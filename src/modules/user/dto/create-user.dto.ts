import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'Must have uppercase, lowercase, and a number',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(6)
  fullName: string;

  @ApiProperty({ type: [String], example: ['8d9b3412-b7a4-46e8-88a3-2a5c4999c88d'] })
  @IsArray({ message: 'Roles must be an array of UUIDs' })
  @ArrayNotEmpty({ message: 'At least one role must be provided' })
  @IsUUID('4', { each: true, message: 'Each role must be a valid UUID' })
  roles: string[];
}
