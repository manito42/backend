import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { MentorFeedbackResponseDto } from './dto/response/mentorFeedbackResponse.dto';
import { MentorFeedbackSelectQuery } from './queries/mentorFeedbackSelect.query';
import { MentorFeedbackCreatePayloadDto } from './dto/request/mentorFeedbackCreatePayload.dto';
import { GetMentorFeedbacksQueryDto } from './dto/request/mentorFeedbackQuery.dto';
import { getMentorFeedbacksWhereQuery } from './queries/getMentorFeedbacksWhereQuery';

@Injectable()
export class MentorFeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: GetMentorFeedbacksQueryDto): Promise<MentorFeedbackResponseDto[]> {
    const { mentor_id, mentee_id, take, page, reservation_id } = query;
    return this.prisma.mentorFeedback.findMany({
      where: getMentorFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
      select: MentorFeedbackSelectQuery,
      take: take,
      skip: page * take,
    });
  }

  async create(body: MentorFeedbackCreatePayloadDto): Promise<MentorFeedbackResponseDto> {
    // find reservation and check if it exists
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: body.reservationId },
    });
    if (!reservation) throw new BadRequestException();
    if (reservation.menteeId !== body.menteeId || reservation.mentorId !== body.mentorId)
      throw new BadRequestException();
    return this.prisma.mentorFeedback.create({
      data: {
        reservationId: body.reservationId,
        menteeId: body.menteeId,
        mentorId: body.mentorId,
        rating: body.rating,
      },
      select: MentorFeedbackSelectQuery,
    });
  }

  async findById(id: number): Promise<MentorFeedbackResponseDto> {
    return this.prisma.mentorFeedback.findUnique({
      where: {
        id,
      },
      select: MentorFeedbackSelectQuery,
    });
  }
}
