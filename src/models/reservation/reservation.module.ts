import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
  exports: [ReservationRepository],
})
export class ReservationModule {}
