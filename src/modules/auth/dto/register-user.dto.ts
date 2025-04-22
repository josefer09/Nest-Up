import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass1!',
    description: 'Password must have a Uppercase, lowercase letter and a number',
    minLength: 6,
    maxLength: 20,
  })  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', minLength: 6 })
  @IsString()
  @MinLength(6)
  fullName: string;
}
