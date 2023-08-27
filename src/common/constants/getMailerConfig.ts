import * as AWS from 'aws-sdk';
import * as process from 'process';
import { MailerOptions } from '@nestjs-modules/mailer';

export async function getMailerConfig(): Promise<MailerOptions> {
  const transporter = new AWS.SES({
    apiVersion: '2010-12-01',
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.MAILER_AWS_KEY_ID,
      secretAccessKey: process.env.MAILER_AWS_SECRET,
    },
  });
  return {
    transport: {
      SES: transporter,
      host: process.env.MAILER_HOST,
      port: +process.env.MAILER_PORT,
    },
    defaults: {
      from: `${process.env.MAILER_SENDER}" <${process.env.MAILER_ADDRESS}>`,
    },
  };
}
