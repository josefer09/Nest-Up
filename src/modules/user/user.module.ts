import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Role } from '@role/entities/role.entity';
import { RoleModule } from '@role/role.module';
import { HashingAdapter } from '@common/adapters';
import { AuthModule } from '@auth/auth.module';
import { EmailModule } from '@email/email.module';

@Module({
  imports: [
    forwardRef(() => AuthModule), // Use forwardRef to resolve circular dependency with AuthModule
    RoleModule,
    EmailModule,
    TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [UserController],
  providers: [UserService, HashingAdapter],
  exports: [UserService],
})
export class UserModule {}
