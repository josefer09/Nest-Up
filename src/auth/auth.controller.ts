import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginUserDto, RegisterUserDto } from './dto';

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

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
