import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { In, Repository } from 'typeorm';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { EmailService } from 'src/email/email.service';
import { HashingAdapter, UuidAdapter } from 'src/common/adapters';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtPayload } from './interfaces';
import { HttpResponseMessage } from 'src/common/utils';
import { Token } from './entities/token.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly hashingAdapter: HashingAdapter,
    private readonly uuidAdapter: UuidAdapter,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registeruserDto: RegisterUserDto) {
    try {
      const { password, roles, ...userData } = registeruserDto;

      const emailExist = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (emailExist) throw new BadRequestException('Email alredy taken.');

      const passworHashing = await this.hashingAdapter.hash(password);

      const foundRoles = await this.roleRepository.findBy({ id: In(roles) });
      if (foundRoles.length !== roles.length)
        throw new BadRequestException('Some roles do not exist.');

      const user = this.userRepository.create({
        ...userData,
        password: passworHashing,
        roles: foundRoles,
      });

      const userSaved = await this.userRepository.manager.transaction(
        async (entityManager) => {
          const savedUser = await entityManager.save(user);

          // const token = await this.createToken(savedUser.id);
          const token = entityManager.create(Token, {
            user: savedUser,
            token: this.uuidAdapter.generate(),
          });

          await entityManager.save(token);

          await this.emailService.sendVerificationEmail(
            savedUser.email,
            token.token,
          );

          return savedUser;
        },
      );

      const { password: _, ...userWithoutPass } = userSaved;

      return {
        message:
          'User registered successfully, we sent you a email with the next instructions.',
        data: userWithoutPass,
      };
    } catch (error) {
      this.logger.error(`Error registering user: ${error.message}`);
      throw error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const INVALID_CREDENTIALS_MSG = 'Invalid credentials.';
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .leftJoinAndSelect('user.roles', 'role')
        .select([
          'user.id',
          'user.email',
          'user.password',
          'role.name',
        ])
        .getOne();

      if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS_MSG);

      //Validate pwd
      const userVerified = await this.hashingAdapter.compare(
        password,
        user.password,
      );
      if (!userVerified) throw new UnauthorizedException(INVALID_CREDENTIALS_MSG);
      
      const userResponse = {
        id: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.name),
      };
      const token = this.getJwtToken(userResponse);

      return HttpResponseMessage.success('Authentication successful.', {
        user: userResponse,
        token,
      });
    } catch (error) {
      this.logger.error(`Error logging in user: ${email} - ${error.message}`);
      throw error;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
