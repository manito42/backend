import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { getMentorFeedbacksWhereQuery } from '../../models/mentorFeedback/queries/getMentorFeedbacksWhereQuery';
import { MentorFeedbackSelectQuery } from '../../models/mentorFeedback/queries/mentorFeedbackSelect.query';
import { MentorFeedbackCreatePayloadDto } from '../../models/mentorFeedback/dto/request/mentorFeedbackCreatePayload.dto';
import { MentorFeedbackResponseDto } from '../../models/mentorFeedback/dto/response/mentorFeedbackResponse.dto';
import { SelectAllType } from '../../common/constants/selectAll.type';
import { MentorFeedbackPaginationResponseDto } from 'src/models/mentorFeedback/dto/response/mentorFeedbackPaginationResponse.dto';

@Injectable()
export class MentorFeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(
    take: number,
    page: number,
    mentor_id: number | SelectAllType,
    mentee_id: number | SelectAllType,
    reservation_id: number | SelectAllType,
  ): Promise<MentorFeedbackPaginationResponseDto> {
    const totalCount = await this.prismaService.mentorFeedback.count({
      where: getMentorFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
    });
    const totalPage = Math.ceil(totalCount / take) - 1;

    return {
      content: await this.prismaService.mentorFeedback.findMany({
        where: getMentorFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
        select: MentorFeedbackSelectQuery,
        take: take,
        skip: page * take,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      page: {
        take: take,
        page: page,
        totalPage: totalPage,
        currentPage: page,
        isLast: totalPage <= page,
      },
    };
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
