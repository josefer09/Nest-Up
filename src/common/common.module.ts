import { Module } from '@nestjs/common';
import { DatabaseExceptionHandler } from './providers/postgres-excetion-handler.provider';

@Module({
  providers: [DatabaseExceptionHandler],
  exports: [DatabaseExceptionHandler],
})
export class CommonModule {}
