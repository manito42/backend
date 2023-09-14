import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { MenteeFeedbackResponseDto } from '../../models/menteeFeedback/dto/response/menteeFeedbackResponse.dto';
import { getMenteeFeedbacksWhereQuery } from '../../models/menteeFeedback/queries/getMenteeFeedbacksWhereQuery';
import { MenteeFeedbackGetSelectQuery } from '../../models/menteeFeedback/queries/menteeFeedbackGetSelect.query';
import { MenteeFeedbackCreatePayloadDto } from '../../models/menteeFeedback/dto/request/menteeFeedbackCreatePayload.dto';
import { SelectAllType } from '../../common/constants/selectAll.type';
import { MenteeFeedbackPaginationResponseDto } from 'src/models/menteeFeedback/dto/response/menteeFeedbackPaginationResponse.dto';

@Injectable()
export class MenteeFeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(
    take: number,
    page: number,
    mentor_id: number | SelectAllType,
    mentee_id: number | SelectAllType,
    reservation_id: number | SelectAllType,
  ): Promise<MenteeFeedbackPaginationResponseDto> {
    const totalCount = await this.prismaService.menteeFeedback.count({
      where: getMenteeFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
    });
    const totalPage = Math.ceil(totalCount / take) - 1;

    return {
      content: await this.prismaService.menteeFeedback.findMany({
        where: getMenteeFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
        select: MenteeFeedbackGetSelectQuery,
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

  async findById(id: number): Promise<MenteeFeedbackResponseDto> {
    return await this.prismaService.menteeFeedback.findUnique({
      where: {
        id,
      },
      select: MenteeFeedbackGetSelectQuery,
    });
  }

  async create(data: MenteeFeedbackCreatePayloadDto): Promise<MenteeFeedbackResponseDto> {
    return await this.prismaService.menteeFeedback.create({
      data: data,
      select: MenteeFeedbackGetSelectQuery,
    });
  }
}
