import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger(NotificationService.name);

  private async notifyByMail(emails: Array<string>, subject: string, content: string) {
    await this.mailerService.sendMail({
      to: emails,
      subject: subject,
      html: content,
    });
    this.logger.log(`Sent mail to ${emails}`);
  }

  /**
   * NOTE: 현재는 메일만 전송함.
   */
  async notify(sendTo: Array<User>, subject: string, content: string) {
    const emails = sendTo.map((user) => user.email);
    await this.notifyByMail(emails, subject, content);
  }
}
