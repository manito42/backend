import { Module } from '@nestjs/common';
import { MentorFeedbackController } from './mentorFeedback.controller';
import { MentorFeedbackService } from './mentorFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MentorFeedbackController],
  providers: [MentorFeedbackService],
})
export class MentorFeedbackModule {}
