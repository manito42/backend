import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerConfig } from '../../common/constants/getMailerConfig';

@Module({
  imports: [MailerModule.forRootAsync({ useFactory: getMailerConfig })],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
