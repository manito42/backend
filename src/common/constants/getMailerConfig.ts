import process from 'process';
import { MailerOptions } from '@nestjs-modules/mailer';

const mailerConfig: MailerOptions = {
  transport: {
    host: process.env.MAILER_HOST,
    port: +process.env.MAILER_PORT,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  },
  defaults: {
    from: `"process.env.MAILER_SENDER" <${process.env.MAILER_ADDRESS}>`,
  },
};
export function getMailerConfig() {
  return mailerConfig;
}
