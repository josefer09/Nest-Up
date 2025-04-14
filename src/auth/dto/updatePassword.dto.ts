import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator.ts/match.decorator.ts.decorator';

export class UpdatePasswordDto {
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
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @Match('password', { message: 'Passwords do not match.'})
  password_confirmation: string;
}
