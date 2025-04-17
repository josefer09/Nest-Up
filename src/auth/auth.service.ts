import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import { EmailService } from 'src/email/email.service';
import { HashingAdapter, UuidAdapter } from 'src/common/adapters';
import { User } from 'src/user/entities/user.entity';
import { EmailDto, LoginUserDto, RegisterUserDto, TokenDto } from './dto';
import { JwtPayload } from './interfaces';
import {
  generateAlphaNumericToken,
  HttpResponseMessage,
} from 'src/common/utils';
import { Token } from './entities/token.entity';
import { Role } from 'src/role/entities/role.entity';
import { TokenType } from './enums';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly hashingAdapter: HashingAdapter,
    private readonly uuidAdapter: UuidAdapter,
  ) {}

  async registerUser(registeruserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = registeruserDto;

      const emailExist = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (emailExist) throw new BadRequestException('Email already taken.');

      const passworHashing = await this.hashingAdapter.hash(password);

      const role = await this.roleRepository.findOne({
        where: { name: 'user' },
        select: { id: true, name: true },
      });
      if (!role)
        throw new InternalServerErrorException(
          'Default role "user" not found. Contact an administrator.',
        );

      // const foundRoles = await this.roleRepository.findBy({ id: In(roles) });
      // if (foundRoles.length !== roles.length)
      //   throw new BadRequestException('Some roles do not exist.');

      const user = this.userRepository.create({
        ...userData,
        password: passworHashing,
        roles: [role],
      });

      const userSaved = await this.userRepository.manager.transaction(
        async (entityManager) => {
          const savedUser = await entityManager.save(user);

          // const token = await this.createToken(savedUser.id);
          const token = entityManager.create(Token, {
            user: savedUser,
            token: this.uuidAdapter.generate(),
            tokenType: TokenType.EMAIL_VERIFICATION,
          });

          await entityManager.save(token);

          await this.emailService.sendVerificationEmail(
            savedUser.email,
            token.token,
          );

          return savedUser;
        },
      );

      const { password: _, ...userWithoutPassRoles } = userSaved;
      const userResponse = {
        ...userWithoutPassRoles,
        roles: [role.name],
      };

      return HttpResponseMessage.success(
        'User registered successfully, we sent you a email with the next instructions.',
        userResponse,
        201,
      );
    } catch (error) {
      this.logger.error(`Error registering user: ${error.message}`);
      throw error;
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const INVALID_CREDENTIALS_MSG = 'Invalid credentials.';
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .leftJoinAndSelect('user.roles', 'role')
        .select([
          'user.id',
          'user.email',
          'user.password',
          'user.isActive',
          'user.isVerified',
          'role.name',
        ])
        .getOne();
      if (!user) throw new UnauthorizedException(INVALID_CREDENTIALS_MSG);

      if (!user.isActive)
        throw new ForbiddenException(
          'Your account has been deactivated. Please contact support.',
        );

      if (!user.isVerified)
        throw new ForbiddenException(
          'Please verify your email before logging in.',
        );

      //Validate pwd
      const userVerified = await this.hashingAdapter.compare(
        password,
        user.password,
      );
      if (!userVerified)
        throw new UnauthorizedException(INVALID_CREDENTIALS_MSG);

      const userResponse = {
        id: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.name),
      };
      const token = this.getJwtToken(userResponse);

      return HttpResponseMessage.success('Authentication successful.', {
        user: userResponse,
        token,
      });
    } catch (error) {
      this.logger.error(`Error logging in user: ${email} - ${error.message}`);
      throw error;
    }
  }

  async verifyEmail(token: string) {
    try {
      const tokenRecord = await this.tokenRepository
        .createQueryBuilder('token')
        .where('token.token = :token', { token })
        .leftJoinAndSelect('token.user', 'user')
        .select([
          'token.id',
          'token.token',
          'token.expiresAt',
          'user.id',
          'user.isActive',
          'user.isVerified',
        ])
        .getOne();

      if (!tokenRecord)
        throw new BadRequestException('Invalid or expired token.');

      if (tokenRecord.isExpired())
        throw new BadRequestException(
          'Token has expired. Please request a new one.',
        );

      const user = tokenRecord.user;

      if (user.isVerified) {
        throw new BadRequestException('User is already verified.');
      }

      user.isVerified = true;

      await Promise.all([
        this.userRepository.save(user),
        this.tokenRepository.delete(tokenRecord.id),
      ]);

      return HttpResponseMessage.success('Email successfully verified.');
    } catch (error) {
      this.logger.error(`Error verifying token: ${token} - ${error.message}`);
      throw error;
    }
  }

  async resendToken(emailDto: EmailDto) {
    const { email } = emailDto;
    try {
      const token = await this.createNewToken(
        email,
        TokenType.EMAIL_VERIFICATION,
      );
      await this.emailService.sendVerificationEmail(email, token);
      return HttpResponseMessage.success(
        'A new verification email has been sent.',
      );
    } catch (error) {
      this.logger.error(
        `Error resending token for email: ${email} - ${error.message}`,
      );
      throw error;
    }
  }

  async forgotPassword(emailDto: EmailDto) {
    const { email } = emailDto;
    try {
      const token = await this.createNewToken(email, TokenType.PASSWORD_RESET);
      await this.emailService.sendPasswordResetEmail(email, token);
      return HttpResponseMessage.success(
        'If an account with that email exists, a password reset link has been sent.',
      );
    } catch (error) {
      this.logger.error(
        `Error sending token for email: ${email} - ${error.message}`,
      );
      throw error;
    }
  }

  async validateToken(tokenDto: TokenDto) {
    const { token } = tokenDto;
    try {
      const tokenExist = await this.tokenRepository.findOne({
        where: { token },
      });
      this.validateTokenPwdExist(tokenExist!);

      return HttpResponseMessage.success('Valid token, set your new password');
    } catch (error) {
      this.logger.error(`Error validating token - ${error.message}`);
      throw error;
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, token: string) {
    const { password } = updatePasswordDto;
    try {
      const tokenExist = await this.tokenRepository
        .createQueryBuilder('token')
        .leftJoinAndSelect('token.user', 'user')
        .addSelect(['user.id', 'user.password'])
        .where('token.token = :token', { token })
        .getOne();
      this.validateTokenPwdExist(tokenExist);

      const user = tokenExist!.user;

      user.password = await this.hashingAdapter.hash(password);

      await Promise.all([
        this.tokenRepository.delete({ id: tokenExist?.id }),
        this.userRepository.save(user),
      ]);

      return HttpResponseMessage.success(
        'Password updated successfully. You can now log in with your new password.',
      );
    } catch (error) {
      this.logger.error(`Error updating password - ${error.message}`);
      throw error;
    }
  }

  private async createNewToken(
    email: string,
    tokenType: TokenType,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, isActive: true, isVerified: true },
      });

      if (!user) throw new NotFoundException('User not found or inactive.');

      this.validateUserBeforeCreateToken(user, tokenType);

      await this.tokenRepository.delete({ user: { id: user.id } });

      // Valid TokenType
      const generatorTokenType: string =
        tokenType === TokenType.EMAIL_VERIFICATION
          ? this.uuidAdapter.generate()
          : generateAlphaNumericToken();

      const newToken = this.tokenRepository.create({
        user,
        token: generatorTokenType,
        tokenType: tokenType,
      });

      await this.tokenRepository.save(newToken);

      return newToken.token;
    } catch (error) {
      this.logger.error(
        `Error creating new token for email: ${email} = ${error.message}`,
      );
      throw error;
    }
  }

  private validateTokenPwdExist(token: Token | undefined | null): Token {
    if (!token || token.tokenType !== TokenType.PASSWORD_RESET)
      throw new UnauthorizedException('Token not valid.');
    if (token.isExpired())
      throw new BadRequestException(
        'Token has expired. Please request a new one.',
      );
    return token;
  }

  private validateUserBeforeCreateToken(user: User, tokenType: TokenType) {
    if (!user || !user.isActive)
      throw new NotFoundException('User not found or inactive.');
    if (!user.isVerified && tokenType === TokenType.PASSWORD_RESET)
      throw new BadRequestException(
        'Your account has not been verified yet. Please check your email for the verification link before resetting your password.',
      );
    if (user.isVerified && tokenType === TokenType.EMAIL_VERIFICATION)
      throw new BadRequestException('User already verified.');
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
