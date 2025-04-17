import {
  BadRequestException,
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

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly hashingAdapter: HashingAdapter,
  ) {}

  

  async create(createUserDto: CreateUserDto) {
    const { password, roles, ...userData } = createUserDto;
    try {
      const emailExist = await this.findUserByEmail(userData.email, false);
      if (emailExist) throw new BadRequestException('Email already taken.');

      const passwordHashing = await this.hashingAdapter.hash(password);

      const foundRoles = await this.roleRepository.findBy({ id: In(roles) });
      if (foundRoles.length !== roles.length) throw new BadRequestException('Some roles do not exist.');

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
        roles: foundRoles.map(role => role.name),
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
    const { limit = 6, offset = 0} = paginationDto;
    try {
      const users = await this.userRepository.find({
        take: limit,
        skip: offset,
      })
      return HttpResponseMessage.success('Users retrieved successfully', users);
    } catch (error) {
      this.logger.error(`Error finding all users - ${error.message}`);
      throw error;
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async findUserByEmail(email: string, throwIfNotFound = true) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user && throwIfNotFound) {
      throw new NotFoundException(`User with email: ${email} not found.`);
    }
    return user;
  }
}
