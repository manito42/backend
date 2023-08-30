import { BadRequestException, Injectable } from '@nestjs/common';
import { MenteeFeedbackResponseDto } from './dto/response/menteeFeedbackResponse.dto';
import { MenteeFeedbackCreatePayloadDto } from './dto/request/menteeFeedbackCreatePayload.dto';
import { GetMenteeFeedbacksQueryDto } from './dto/request/menteeFeedbackQuery.dto';
import { MenteeFeedbackRepository } from '../../database/repository/menteeFeedback.repository';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { SelectAllType } from '../../common/constants/selectAll.type';

@Injectable()
export class MenteeFeedbackService {
  constructor(
    private readonly menteeFeedbackRepository: MenteeFeedbackRepository,
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async findManyMenteeFeedback(
    take: number,
    page: number,
    mentee_id: number | SelectAllType,
    mentor_id: number | SelectAllType,
    reservation_id: number | SelectAllType,
  ): Promise<MenteeFeedbackResponseDto[]> {
    return await this.menteeFeedbackRepository.findMany(
      take,
      page,
      mentor_id,
      mentee_id,
      reservation_id,
    );
  }

  async createMenteeFeedback(
    body: MenteeFeedbackCreatePayloadDto,
  ): Promise<MenteeFeedbackResponseDto> {
    //reservation id가 존재하는지 확인
    const reservation = await this.reservationRepository.findById(body.reservationId);
    if (!reservation) throw new BadRequestException();
    if (reservation.menteeId !== body.menteeId || reservation.mentorId !== body.mentorId)
      throw new BadRequestException();

    return await this.menteeFeedbackRepository.create(body);
  }

  async findMenteeFeedbackById(id: number): Promise<MenteeFeedbackResponseDto> {
    return await this.menteeFeedbackRepository.findById(id);
  }
}
