import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { MenteeFeedbackResponseDto } from './dto/response/menteeFeedbackResponse.dto';
import { MenteeFeedbackGetSelectQuery } from './queries/menteeFeedbackGetSelect.query';
import { MenteeFeedbackCreatePayloadDto } from './dto/request/menteeFeedbackCreatePayload.dto';
import { GetMenteeFeedbacksQueryDto } from './dto/request/menteeFeedbackQuery.dto';
import { getMenteeFeedbacksWhereQuery } from './queries/getMenteeFeedbacksWhereQuery';

@Injectable()
export class MenteeFeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: GetMenteeFeedbacksQueryDto): Promise<MenteeFeedbackResponseDto[]> {
    const { mentor_id, mentee_id, take, page, reservation_id } = query;
    return this.prisma.menteeFeedback.findMany({
      where: getMenteeFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
      select: MenteeFeedbackGetSelectQuery,
      take: take,
      skip: page * take,
    });
  }

  async create(body: MenteeFeedbackCreatePayloadDto): Promise<MenteeFeedbackResponseDto> {
    // find reservation and check if it exists
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: body.reservationId },
    });
    if (!reservation) throw new BadRequestException();
    if (reservation.menteeId !== body.menteeId || reservation.mentorId !== body.mentorId)
      throw new BadRequestException();
    return this.prisma.menteeFeedback.create({
      data: body,
      select: MenteeFeedbackGetSelectQuery,
    });
  }

  async findById(id: number): Promise<MenteeFeedbackResponseDto> {
    return this.prisma.menteeFeedback.findUnique({
      where: {
        id,
      },
      select: MenteeFeedbackGetSelectQuery,
    });
  }
}
