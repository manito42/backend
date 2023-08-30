import { Module } from '@nestjs/common';
import { MentorFeedbackController } from './mentorFeedback.controller';
import { MentorFeedbackService } from './mentorFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { MentorFeedbackRepository } from '../../database/repository/mentorFeedback.repository';
import { ReservationRepository } from '../../database/repository/reservation.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MentorFeedbackController],
  providers: [MentorFeedbackService, MentorFeedbackRepository, ReservationRepository],
})
export class MentorFeedbackModule {}
