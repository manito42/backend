import { Module } from '@nestjs/common';
import { MentorFeedbackController } from './mentorFeedback.controller';
import { MentorFeedbackService } from './mentorFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { JwtConfigModule } from 'src/config/jwt/config.module';

@Module({
  imports: [PrismaModule, JwtConfigModule],
  controllers: [MentorFeedbackController],
  providers: [MentorFeedbackService],
})
export class MentorFeedbackModule {}
