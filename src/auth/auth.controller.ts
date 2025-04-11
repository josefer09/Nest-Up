import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginUserDto, RegisterUserDto, TokenDto } from './dto';

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
  resendToken(@Body() emailDto: EmailDto) {
    return this.authService.resendToken(emailDto);
  }

  @Post('reset-password')
  resetPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto);
  }

  @Post('validate-token')
  validateToken(@Body() tokenDto: TokenDto) {
    return this.authService
  }
}
