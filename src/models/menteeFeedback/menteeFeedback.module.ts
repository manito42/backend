import { Module } from '@nestjs/common';
import { MenteeFeedbackController } from './menteeFeedback.controller';
import { MenteeFeedbackService } from './menteeFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MenteeFeedbackController],
  providers: [MenteeFeedbackService],
})
export class MenteeFeedbackModule {}
