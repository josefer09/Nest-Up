import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthUser, JwtPayload } from '../interfaces';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET')!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<AuthUser> {
    const { id } = payload;

    const user = await this.userRepository.findOne({
      where: { id },
      select: { id: true, email: true, fullName: true, isActive: true, isVerified: true, },
      relations: ['roles'],
    });

    if (!user) throw new UnauthorizedException('Token Not Valid.');

    if (!user.isActive) throw new UnauthorizedException('User is not active.');

    return {
        ...user,
        roles: user.roles.map( role => role.name ),
    }
  }
}
