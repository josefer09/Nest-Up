import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { EmailService } from 'src/email/email.service';
import { HashingAdapter } from 'src/common/adapters';
import { User } from 'src/user/entities/user.entity';
import { RegisterUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly hashingAdapter: HashingAdapter,
    private readonly jwtService: JwtService
  ) {}
  async registerUser(registeruserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = registeruserDto;
      const passworHashing = await this.hashingAdapter.hash(password);
      const emailExist = await this.userRepository.findOne({ where: { email: userData.email }});
      if( emailExist ) throw new BadRequestException('Email alredy taken.');
      const user = this.userRepository.create({
        ...userData,
        password: passworHashing,
      });
      const userSaved = await this.userRepository.save(user);
      const { password: _, ...userWithoutPass } = userSaved;
      return {
        msg: 'User Created Successfully.',
        ...userSaved,
        token: this.getJwtToken({ email: userSaved.email, id: userSaved.id }),
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
}
