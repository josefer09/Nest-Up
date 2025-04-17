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

export class RegisterUserDto {

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(6)
  fullName: string;

  // @IsArray({ message: 'Roles must be an array of UUIDs' })
  // @ArrayNotEmpty({ message: 'At least one role must be provided' })
  // @IsUUID('4', { each: true, message: 'Each role must be a valid UUID' })
  // roles: string[];
}
