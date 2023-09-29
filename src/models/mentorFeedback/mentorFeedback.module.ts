import { Module } from '@nestjs/common';
import { MentorFeedbackController } from './mentorFeedback.controller';
import { MentorFeedbackService } from './mentorFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { MentorFeedbackRepository } from '../../database/repository/mentorFeedback.repository';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [PrismaModule, ReservationModule],
  controllers: [MentorFeedbackController],
  providers: [MentorFeedbackService, MentorFeedbackRepository],
  exports: [MentorFeedbackRepository],
})
export class MentorFeedbackModule {}
