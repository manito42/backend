import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { JwtStrategy } from '../../common/guards/jwt/jwt.strategy';
import { JwtConfigModule } from '../../config/jwt/config.module';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { UserRepository } from '../../database/repository/user.repository';

@Module({
  imports: [PrismaModule, JwtConfigModule, EventEmitterModule.forRoot()],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    UserRepository,
    ReservationRepository,
    JwtGuard,
    JwtStrategy,
    EventEmitter2,
  ],
})
export class ReservationModule {}
