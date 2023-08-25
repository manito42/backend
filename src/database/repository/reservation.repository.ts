import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {
    console.log('ReservationRepository');
  }

  async mentor_completion() {}
}
