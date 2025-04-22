import { Module } from '@nestjs/common';
import { DatabaseExceptionHandler } from './providers/postgres-excetion-handler.provider';
import { HashingAdapter } from './adapters'; 
import { UuidAdapter } from './adapters/uuid-adapter/uuid-adapter';

@Module({
  providers: [DatabaseExceptionHandler, HashingAdapter, UuidAdapter],
  exports: [DatabaseExceptionHandler],
})
export class CommonModule {}
