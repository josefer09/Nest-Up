import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginUserDto, RegisterUserDto, TokenDto } from './dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { TokenValidationPipe } from './pipes';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './enums';
import { AuthUser } from './interfaces';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiQuery({ name: 'token', type: 'string', description: 'UUID Token' })
  verifyEmail(@Query('token', ParseUUIDPipe) token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-token')
  @ApiOperation({ summary: 'Resend email verification token' })
  @ApiBody({ type: EmailDto })
  @HttpCode(200)
  resendToken(@Body() emailDto: EmailDto) {
    return this.authService.resendToken(emailDto);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send password reset token' })
  @ApiBody({ type: EmailDto })
  resetPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto);
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validate a reset token' })
  @ApiBody({ type: TokenDto })
  validateToken(@Body() tokenDto: TokenDto) {
    return this.authService.validateToken(tokenDto);
  }

  @Post('update-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update password using reset token' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiQuery({ name: 'token', type: 'string', description: 'Reset token' })
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Query('token', TokenValidationPipe) token: string) {
    return this.authService.updatePassword(updatePasswordDto, token);
  }

  @Get('test-private')
  @Auth(ValidRoles.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test private route (requires auth)' })
  testPrivate(@GetUser() user: AuthUser) {
    
    return { message: 'success', user };
  }

}