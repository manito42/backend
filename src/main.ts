import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './common/middlewares/logger/winston.util';
import { ValidationPipe } from '@nestjs/common';
import { ValidationOptions } from './common/pipes/validationPipe/validationOptions.constant';
import { PrismaClientExceptionFilter } from './common/filters/prismaClientException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  const PORT = process.env.APP_PORT || 3000;
  app.useGlobalPipes(new ValidationPipe(ValidationOptions));
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  // 추후 변경할 것
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
