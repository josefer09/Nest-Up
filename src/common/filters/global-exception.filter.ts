import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm'; // Detectar errores de TypeORM

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message: string | object = 'Unexpected server error';
    let error: string = 'Internal Server Error';

    //? If it's a Nest HttpException Error
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = exceptionResponse['message'] || message;
        error = exceptionResponse['error'] || error;
      } else {
        message = exceptionResponse || message;
      }
    }

    //? 📌 If it's a database error (e.g. unique key violation)
    else if (exception instanceof QueryFailedError) {
      status = 400;
      message = 'A database error occurred';
      error = 'Bad Request';

      this.logger.error(
        `Database error: ${exception.message}`,
        exception.stack,  // Uncomment for more detail about error.
      );
    }

    //? If it's a general error
    else if (exception instanceof Error) {
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
    });
  }
}
