import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
  accessUrl: process.env.ACCESS_URL,
  apiUrl: process.env.API_URL,
}));
