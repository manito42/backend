import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { MenteeFeedbackResponseDto } from '../../models/menteeFeedback/dto/response/menteeFeedbackResponse.dto';
import { getMenteeFeedbacksWhereQuery } from '../../models/menteeFeedback/queries/getMenteeFeedbacksWhereQuery';
import { MenteeFeedbackGetSelectQuery } from '../../models/menteeFeedback/queries/menteeFeedbackGetSelect.query';
import { MenteeFeedbackCreatePayloadDto } from '../../models/menteeFeedback/dto/request/menteeFeedbackCreatePayload.dto';

@Injectable()
export class MenteeFeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(
    mentor_id: number,
    mentee_id: number,
    reservation_id: number,
    take: number,
    page: number,
  ): Promise<MenteeFeedbackResponseDto[]> {
    return this.prismaService.menteeFeedback.findMany({
      where: getMenteeFeedbacksWhereQuery(mentor_id, mentee_id, reservation_id),
      select: MenteeFeedbackGetSelectQuery,
      take: take,
      skip: page * take,
    });
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
