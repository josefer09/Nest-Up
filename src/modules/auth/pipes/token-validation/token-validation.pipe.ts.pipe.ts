import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TokenValidationPipe implements PipeTransform {
  transform(value: any): string {
    const token = String(value);

    const isValidToken = /^[A-Za-z0-9]{6}$/.test(token);
    if (!isValidToken) {
      throw new BadRequestException(
        'Token must be exactly 6 alphanumeric characters',
      );
    }

    return token;
  }
}
