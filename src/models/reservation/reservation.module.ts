import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { JwtStrategy } from '../../common/guards/jwt/jwt.strategy';
import { JwtConfigModule } from '../../config/jwt/config.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PrismaModule, JwtConfigModule, EventEmitterModule],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository, JwtGuard, JwtStrategy],
})
export class ReservationModule {}
