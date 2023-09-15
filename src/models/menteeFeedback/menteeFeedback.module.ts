import { Module } from '@nestjs/common';
import { MenteeFeedbackController } from './menteeFeedback.controller';
import { MenteeFeedbackService } from './menteeFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { MenteeFeedbackRepository } from '../../database/repository/menteeFeedback.repository';
import { ReservationRepository } from '../../database/repository/reservation.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MenteeFeedbackController],
  providers: [MenteeFeedbackService, MenteeFeedbackRepository, ReservationRepository],
})
export class MenteeFeedbackModule {}
