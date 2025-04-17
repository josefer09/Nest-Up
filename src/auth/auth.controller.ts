import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginUserDto, RegisterUserDto, TokenDto } from './dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { TokenValidationPipe } from './pipes';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './enums';
import { AuthUser } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('verify-email')
  verifyEmail(@Query('token', ParseUUIDPipe) token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-token')
  @HttpCode(200)
  resendToken(@Body() emailDto: EmailDto) {
    return this.authService.resendToken(emailDto);
  }

  @Post('forgot-password')
  @HttpCode(200)
  resetPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto);
  }

  @Post('validate-token')
  validateToken(@Body() tokenDto: TokenDto) {
    return this.authService.validateToken(tokenDto);
  }

  @Post('update-password')
  @HttpCode(200)
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Query('token', TokenValidationPipe) token: string) {
    return this.authService.updatePassword(updatePasswordDto, token);
  }

  @Get('test-private')
  @Auth(ValidRoles.user)
  testPrivate(@GetUser() user: AuthUser) {
    
    return { message: 'success', user };
  }

}