import { HttpStatus } from '@nestjs/common';

export abstract class HttpResponseMessage {
  static success(message: string, data?: object, statusCode: number = HttpStatus.OK) {
    return {
      statusCode,
      message,
      ...(data !== undefined && { data }),
    };
  }

  static created(entity: string, data?: object) {
    return this.success(`${entity} created successfully`, data, HttpStatus.CREATED);
  }

  static updated(entity: string, data?: object) {
    return this.success(`${entity} updated successfully`, data);
  }

  static deleted(entity: string, data?: object) {
    return this.success(`${entity} deleted successfully`, data);
  }  

  // Generic method for greater flexibility
  static custom(message: string, data?: object, statusCode: number = HttpStatus.OK) {
    return { statusCode, message, data: data ?? null };
  }
}
