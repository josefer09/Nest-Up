import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '@common/decorators/match.decorator.ts/match.decorator.ts.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'NewPass123!',
    description: 'New password',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: 'NewPass123!',
    description: 'New password',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @Match('password', { message: 'Passwords do not match.'})
  password_confirmation: string;
}
