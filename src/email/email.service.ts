import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly emailEnabled: boolean;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.emailEnabled = configService.get<boolean>('EMAIL_ENABLED', true);
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false), // false for TLS - true for SSL
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    if( !this.emailEnabled ) {
      this.logger.warn(`Email sending is disabled. Skipping email to: ${to}`);
      return null;
    }
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Correo enviado a ${to}, MessageID: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}, error: ${error.message}`);
      throw new Error('Error sending email');
    }
  }

  // Método para enviar correo de verificación
  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `https://yourfrontendurl.com/verify-email?token=${token}`;
    const subject = 'Email Verification';
    const text = `Hello,

      Thank you for registering with us. Please click the link below to verify your email address and complete the registration process:

      ${verificationUrl}

      If you did not register, please ignore this email.

      Best regards,
      Your Company Name`;

    const html = `
      <p>Hello,</p>
      <p>Thank you for registering with us. Please click the link below to verify your email address and complete the registration process:</p>
      <a href="${verificationUrl}">Click here to verify your email</a>
      <p>If you did not register, please ignore this email.</p>
      <p>Best regards,<br>Your Company Name</p>
    `;

    // Enviar el correo
    await this.sendMail(to, subject, text, html);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `https://yourfrontendurl.com/reset-password?token=${token}`;
    return this.sendMail(
      to,
      'Password Reset',
      `Hello,

      We received a request to reset your password. Click the link below to proceed:

      ${resetUrl}

      If you did not request this, please ignore this email.

      Best regards,
      Your Company Name`,
            `<p>Hello,</p>
            <p>We received a request to reset your password. Click the link below to proceed:</p>
            <a href="${resetUrl}">Reset your password</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Your Company Name</p>`
    );
  }
}
