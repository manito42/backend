import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { ReservationRepository } from '../../database/repository/reservation.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
