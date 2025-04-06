import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { EmailService } from 'src/email/email.service';
import { HashingAdapter, UuidAdapter } from 'src/common/adapters';
import { User } from 'src/user/entities/user.entity';
import { RegisterUserDto } from './dto';
import { JwtPayload } from './interfaces';
import { HttpResponseMessage } from 'src/common/utils';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly hashingAdapter: HashingAdapter,
    private readonly uuidAdapter: UuidAdapter,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registeruserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = registeruserDto;

      const emailExist = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (emailExist) throw new BadRequestException('Email alredy taken.');

      const passworHashing = await this.hashingAdapter.hash(password);
      const user = this.userRepository.create({
        ...userData,
        password: passworHashing,
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

  private async createToken(userId: string): Promise<Token> {
    await this.tokenRepository.delete({ user: { id: userId } });
    const newToken = this.tokenRepository.create({
      user: { id: userId },
      token: this.uuidAdapter.generate(),
    });
    return await this.tokenRepository.save(newToken);
  }
}
