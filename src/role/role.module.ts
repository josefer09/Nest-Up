import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DatabaseExceptionHandler } from 'src/common/providers/postgres-excetion-handler.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService, DatabaseExceptionHandler],
  exports: [RoleService],
})
export class RoleModule {}
