import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class DatabaseExceptionHandler {
  private logger = new Logger('DatabaseExceptionHandler');

  handle(error: any): never {
    if (error instanceof HttpException) throw error;

    const message = this.getErrorMessage(error);

    this.logger.error(`Database error: ${message}`, error);
    throw new BadRequestException(message);
  }

  private getErrorMessage(error: any): string {
    if (!error || !error.message) {
      return 'An unexpected database error occurred.';
    }

    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('duplicate') || errorMessage.includes('unique constraint')) {
      return 'Duplicate entry detected. Please check your input.';
    }

    if (errorMessage.includes('null value') || errorMessage.includes('cannot be null')) {
      return 'A required field is missing.';
    }

    if (errorMessage.includes('foreign key constraint')) {
      return 'A foreign key constraint was violated.';
    }

    if (errorMessage.includes('invalid input syntax')) {
      return 'Invalid data format.';
    }

    return 'An unexpected database error occurred.';
  }
}
