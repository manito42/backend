import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/services/prisma.service';
import { UserModule } from './models/user/user.module';
import { LoggerMiddleware } from './common/middleswares/logger/logger.middleware';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
