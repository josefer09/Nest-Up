import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { HashingAdapter } from 'src/common/adapters';
import { HttpResponseMessage } from 'src/common/utils';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthUser } from 'src/auth/interfaces';
import { ChangePasswordDto } from './dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly emailService: EmailService,
    private readonly hashingAdapter: HashingAdapter,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, roles, ...userData } = createUserDto;
    try {
      const emailExist = await this.findUserByEmail(userData.email, false);
      if (emailExist) throw new BadRequestException('Email already taken.');

      const passwordHashing = await this.hashingAdapter.hash(password);

      const foundRoles = await this.findRolesExist(roles);

      // Create User
      const user = this.userRepository.create({
        ...userData,
        password: passwordHashing,
        roles: foundRoles,
      });

      user.isVerified = true;
      const userSaved = await this.userRepository.save(user);

      const { password: _, ...userWithoutPsswd } = userSaved;
      const userResponse = {
        ...userWithoutPsswd,
        roles: foundRoles.map((role) => role.name),
      };

      return HttpResponseMessage.created('User', userResponse);
    } catch (error) {
      this.logger.error(
        `Error creating user: ${userData.email} - ${error.message}`,
      );
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 6, offset = 0 } = paginationDto;
    try {
      const users = await this.userRepository.find({
        take: limit,
        skip: offset,
      });
      return HttpResponseMessage.success('Users retrieved successfully', users);
    } catch (error) {
      this.logger.error(`Error finding all users - ${error.message}`);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.findUserById(id);
      return user;
    } catch (error) {
      this.logger.error(`Error finding user with id: ${id} - ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'],
      });

      if (!user || !user.isActive) {
        throw new NotFoundException(
          `User with id ${id} not found or inactive.`,
        );
      }
      if (!user.isVerified)
        throw new ForbiddenException(
          'User needs to be verified before updating.',
        );

      if (updateUserDto.roles && updateUserDto.roles.length > 0) {
        const roles = await this.findRolesExist(updateUserDto.roles);
        user.roles = roles;
      }

      const { roles, ...rest } = updateUserDto;

      Object.assign(user, rest);

      await this.userRepository.save(user);
      return HttpResponseMessage.updated('User', user);
    } catch (error) {
      this.logger.error(
        `Error updating user: ${updateUserDto.fullName} - ${error.message}`,
      );
      throw error;
    }
  }

  async updateStatusUser(id: string, isActive: boolean) {
    try {
      const user = await this.findUserById(id, {requireActive: false, requireVerified: true});
      user.isActive = isActive;
      await this.userRepository.save(user);
      if (isActive) await this.emailService.sendAccountUnblockedEmail(user.email);
      await this.emailService.sendAccountBlockedEmail(user.email);
      return HttpResponseMessage.success(`User has been successfully ${isActive ? 'unblocked' : 'blocked'}.`);
    } catch (error) {
      this.logger.error(
        `Error updating property active for user with id: ${id} - ${error.message}`,
      );
      throw error;
    }
  }

  async changePassword(user: AuthUser, changePasswordDto: ChangePasswordDto) {
      const { currentPassword, newPassword, } = changePasswordDto;
      try {
        const userDB = await this.userRepository.findOne({ where: { id: user.id }, select: { id: true, password: true, isActive: true, isVerified: true, }});
        console.log(userDB);
        this.logger.debug(user);
        if (!userDB || !userDB.isActive) throw new NotFoundException('User not found or inactive.');
        if (!userDB.isVerified) throw new BadRequestException('Your account has not been verified yet. Please check your email for the verification link before resetting your password.');

        const isValidPassword = await this.hashingAdapter.compare(currentPassword, userDB.password);
  
        if (!isValidPassword) throw new BadRequestException('Current password is incorrect.');
  
        userDB.password = await this.hashingAdapter.hash(newPassword);
        await this.userRepository.save(userDB);
  
        return HttpResponseMessage.success('Password updated successfully.');
      } catch (error) {
        this.logger.error(`Error changing password for user: ${user.fullName} - ${error.message}`);
        throw error;
      }
    }

  async remove(id: string) {
    try {
      const user = await this.findUserById(id);
      await this.userRepository.delete(id);
      await this.emailService.sendAccountDeletedEmail(user.email);
      return HttpResponseMessage.deleted('User', {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      });
    } catch (error) {
      this.logger.error(`Error removing user with id: ${id} - ${error.message}`);
      throw error;
    }
  }

  private async findUserByEmail(email: string, throwIfNotFound = true) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user && throwIfNotFound) {
      throw new NotFoundException(`User with email: ${email} not found.`);
    }
    return user;
  }

  private async findUserById(
    id: string,
    options = { requireActive: true, requireVerified: true },
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: { roles: true },
      });
      if (!user) throw new NotFoundException(`User with id: ${id} not found.`);
      if (options.requireActive && !user.isActive)
        throw new NotFoundException(`User with id: ${id} is inactive.`);
      if (options.requireVerified && !user.isVerified)
        throw new ForbiddenException(`User must be verified.`);
      return user;
    } catch (error) {
      this.logger.error(`Error finding user with id: ${id} - ${error.message}`);
      throw error;
    }
  }

  private async findRolesExist(roles: string[]): Promise<Role[]> {
    const foundRoles = await this.roleRepository.findBy({ id: In(roles) });
    if (foundRoles.length !== roles.length)
      throw new BadRequestException('Some roles do not exist.');
    return foundRoles;
  }
}
