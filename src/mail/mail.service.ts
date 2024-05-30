import { Injectable } from '@nestjs/common';
import { MailDto } from './dto/mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async postMail(body: MailDto) {
    try {
      await this.mailerService.sendMail({
        to: body.to,
        from: body.from,
        subject: body.subject,
        text: body.text,
      });
      return { message: 'send success' };
    } catch (error) {
      console.log(error);
    }
  }
}
