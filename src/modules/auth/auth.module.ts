import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from '@email/email.module';
import { User } from '@user/entities/user.entity';
import { HashingAdapter, UuidAdapter } from '@common/adapters';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Token } from './entities/token.entity';
import { Role } from '@role/entities/role.entity';
import { UserModule } from '@user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashingAdapter, JwtStrategy, UuidAdapter],
  imports: [
    TypeOrmModule.forFeature([Token, Role]),
    EmailModule,
    ConfigModule,
    forwardRef(() => AuthModule), // Use forwardRef to resolve circular dependency with AuthModule
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    })
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
