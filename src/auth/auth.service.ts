import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly configService: ConfigService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    Logger.error('Hello');
    const secretkey: string = this.configService.get<string>('JWT_SECRET')!;
    Logger.log(secretkey);
    return 'This action adds a new auth';
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
}
