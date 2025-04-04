import { Module } from '@nestjs/common';
import { DatabaseExceptionHandler } from './providers/postgres-excetion-handler.provider';
import { HashingAdapter } from './adapters'; 

@Module({
  providers: [DatabaseExceptionHandler, HashingAdapter],
  exports: [DatabaseExceptionHandler],
})
export class CommonModule {}
