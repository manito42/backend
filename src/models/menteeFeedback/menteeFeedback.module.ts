import { Module } from '@nestjs/common';
import { MenteeFeedbackController } from './menteeFeedback.controller';
import { MenteeFeedbackService } from './menteeFeedback.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { JwtConfigModule } from 'src/config/jwt/config.module';

@Module({
  imports: [PrismaModule, JwtConfigModule],
  controllers: [MenteeFeedbackController],
  providers: [MenteeFeedbackService],
})
export class MenteeFeedbackModule {}
