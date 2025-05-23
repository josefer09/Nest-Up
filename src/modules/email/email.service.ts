import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly emailEnabled: boolean;
  private readonly logger = new Logger(EmailService.name);
  private readonly companyName: string;

  constructor(private readonly configService: ConfigService) {
    this.emailEnabled = this.configService.get<boolean>('EMAIL_ENABLED', true);
    this.companyName = this.configService.get<string>('COMPANY_NAME', 'Company_name'),
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

  sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    const subject = 'Email Verification';
    const html = `
    <p>Hello,</p>
    <p>Thank you for registering with us. Please click the link below to verify your email address and complete the registration process:</p>
    <a href="${verificationUrl}">Click here to verify your email</a>
    <p>If you did not register, please ignore this email.</p>
    <p>Best regards,<br>${this.companyName}</p>
  `;
  const text = html.replace(/<\/?[^>]+(>|$)/g, "");

  return this.sendMail(to, subject, text, html);
  }

  sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;
    
    const subject = 'Password Reset';
    const html = `
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset your password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>${this.companyName}</p>
    `;
  
    const text = html.replace(/<\/?[^>]+(>|$)/g, "");
  
    return this.sendMail(to, subject, text, html);
  }

  sendAccountBlockedEmail(to: string) {
    const subject = 'Account Blocked';
    const html = `
      <p>Hello,</p>
      <p>Your account has been <strong>blocked</strong> due to administrative action.</p>
      <p>If you think this is a mistake, please contact our support team.</p>
      <p>Best regards,<br>${this.companyName}</p>
    `;
    const text = html.replace(/<\/?[^>]+(>|$)/g, '');
  
    return this.sendMail(to, subject, text, html);
  }
  
  sendAccountUnblockedEmail(to: string) {
    const subject = 'Account Unblocked';
    const html = `
      <p>Hello,</p>
      <p>Your account has been <strong>unblocked</strong>. You can now access your account as usual.</p>
      <p>Best regards,<br>${this.companyName}</p>
    `;
    const text = html.replace(/<\/?[^>]+(>|$)/g, '');
  
    return this.sendMail(to, subject, text, html);
  }
  
  sendAccountDeletedEmail(to: string) {
    const subject = 'Account Deleted';
    const html = `
      <p>Hello,</p>
      <p>We want to inform you that your account has been <strong>deleted</strong>. This action is irreversible.</p>
      <p>If you did not request this, please contact us immediately.</p>
      <p>Best regards,<br>${this.companyName}</p>
    `;
    const text = html.replace(/<\/?[^>]+(>|$)/g, '');
  
    return this.sendMail(to, subject, text, html);
  }
  
  
}
