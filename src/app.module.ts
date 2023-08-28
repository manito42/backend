import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './models/user/user.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { HashtagModule } from './models/hashtag/hashtag.module';
import { MentorFeedbackModule } from './models/mentorFeedback/mentorFeedback.module';
import { MenteeFeedbackModule } from './models/menteeFeedback/menteeFeedback.module';
import { MentorProfileModule } from './models/mentorProfile/mentorProfile.module';
import { ReservationModule } from './models/reservation/reservation.module';
import { CategoryModule } from './models/category/category.module';
import { AuthModule } from './modules/auth/auth.module';
import { FtConfigModule } from './config/ft/config.module';
import { JwtConfigModule } from './config/jwt/config.module';
import { AppConfigModule } from './config/app/config.module';
import { SearchModule } from './modules/search/search.module';
import { HomeModule } from './modules/home/home.module';
import { DevModule } from './modules/dev/dev.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './modules/notification/notification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerConfig } from './common/constants/getMailerConfig';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CategoryModule,
    HashtagModule,
    MenteeFeedbackModule,
    MentorFeedbackModule,
    MentorProfileModule,
    ReservationModule,
    UserModule,
    FtConfigModule,
    JwtConfigModule,
    AppConfigModule,
    SearchModule,
    HomeModule,
    AuthModule,
    DevModule,
    NotificationModule,
    MailerModule.forRootAsync({ useFactory: getMailerConfig }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
