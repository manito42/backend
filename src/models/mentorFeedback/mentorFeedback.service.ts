import { BadRequestException, Injectable } from '@nestjs/common';
import { MentorFeedbackResponseDto } from './dto/response/mentorFeedbackResponse.dto';
import { MentorFeedbackCreatePayloadDto } from './dto/request/mentorFeedbackCreatePayload.dto';
import { GetMentorFeedbacksQueryDto } from './dto/request/mentorFeedbackQuery.dto';
import { MentorFeedbackRepository } from '../../database/repository/mentorFeedback.repository';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { SelectAllType } from '../../common/constants/selectAll.type';

@Injectable()
export class MentorFeedbackService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly mentorFeedbackRepository: MentorFeedbackRepository,
  ) {}

  async findManyMentorFeedbacks(
    take: number,
    page: number,
    mentor_id: number | SelectAllType,
    mentee_id: number | SelectAllType,
    reservation_id: number | SelectAllType,
  ): Promise<MentorFeedbackResponseDto[]> {
    return await this.mentorFeedbackRepository.findMany(
      take,
      page,
      mentor_id,
      mentee_id,
      reservation_id,
    );
  }

  async createMentorFeedback(
    body: MentorFeedbackCreatePayloadDto,
  ): Promise<MentorFeedbackResponseDto> {
    // find reservation and check if it exists
    const reservation = await this.reservationRepository.findById(body.reservationId);
    if (!reservation) throw new BadRequestException();
    if (reservation.menteeId !== body.menteeId || reservation.mentorId !== body.mentorId)
      throw new BadRequestException();

    return await this.mentorFeedbackRepository.create(body);
  }

  async findMentorFeedbackById(id: number): Promise<MentorFeedbackResponseDto> {
    return await this.mentorFeedbackRepository.findById(id);
  }
}
