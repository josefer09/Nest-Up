import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DatabaseExceptionHandler } from '@common/providers/postgres-excetion-handler.provider';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), AuthModule],
  controllers: [RoleController],
  providers: [RoleService, DatabaseExceptionHandler],
  exports: [RoleService],
})
export class RoleModule {}
