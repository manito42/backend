import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { getMentorFeedbacksWhereQuery } from '../../models/mentorFeedback/queries/getMentorFeedbacksWhereQuery';
import { MentorFeedbackSelectQuery } from '../../models/mentorFeedback/queries/mentorFeedbackSelect.query';
import { MentorFeedbackCreatePayloadDto } from '../../models/mentorFeedback/dto/request/mentorFeedbackCreatePayload.dto';
import { MentorFeedbackResponseDto } from '../../models/mentorFeedback/dto/response/mentorFeedbackResponse.dto';

@Injectable()
export class MentorFeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(
    mentor_id: number,
    mentee_id: number,
    reservation_id: number,
    take: number,
    page: number,
  ): Promise<MentorFeedbackResponseDto[]> {
    return await this.prismaService.mentorFeedback.findMany({
      where: getMentorFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
      select: MentorFeedbackSelectQuery,
      take: take,
      skip: page * take,
    });
  }

  async create(data: MentorFeedbackCreatePayloadDto): Promise<MentorFeedbackResponseDto> {
    return await this.prismaService.mentorFeedback.create({
      data: {
        reservationId: data.reservationId,
        menteeId: data.menteeId,
        mentorId: data.mentorId,
        rating: data.rating,
      },
      select: MentorFeedbackSelectQuery,
    });
  }

  async findById(id: number): Promise<MentorFeedbackResponseDto> {
    return await this.prismaService.mentorFeedback.findUnique({
      where: {
        id,
      },
      select: MentorFeedbackSelectQuery,
    });
  }
}
