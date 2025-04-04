import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, // false para TLS - true para SSL
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'), // Remitente
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Correo enviado a ${to}, MessageID: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${to}: ${error.message}`);
      throw new Error('Error al enviar el correo');
    }
  }
}
