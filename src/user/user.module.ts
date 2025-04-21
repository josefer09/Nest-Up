import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleModule } from 'src/role/role.module';
import { HashingAdapter } from 'src/common/adapters';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';

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
