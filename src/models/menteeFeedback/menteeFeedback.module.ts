import { Module } from '@nestjs/common';
import { MenteeFeedbackController } from './menteeFeedback.controller';
import { MenteeFeedbackService } from './menteeFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { MenteeFeedbackRepository } from '../../database/repository/menteeFeedback.repository';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [PrismaModule, ReservationModule],
  controllers: [MenteeFeedbackController],
  providers: [MenteeFeedbackService, MenteeFeedbackRepository],
  exports: [MenteeFeedbackRepository],
})
export class MenteeFeedbackModule {}
