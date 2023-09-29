import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { JwtConfigModule } from 'src/config/jwt/config.module';

@Module({
  imports: [PrismaModule, JwtConfigModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
