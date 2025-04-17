import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { HashingAdapter } from 'src/common/adapters';
import { RoleModule } from 'src/role/role.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService, HashingAdapter],
  imports: [AuthModule, RoleModule,]
})
export class SeedModule {}
