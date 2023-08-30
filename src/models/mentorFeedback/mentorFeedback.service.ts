import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { MentorFeedbackResponseDto } from './dto/response/mentorFeedbackResponse.dto';
import { MentorFeedbackSelectQuery } from './queries/mentorFeedbackSelect.query';
import { MentorFeedbackCreatePayloadDto } from './dto/request/mentorFeedbackCreatePayload.dto';
import { GetMentorFeedbacksQueryDto } from './dto/request/mentorFeedbackQuery.dto';
import { getMentorFeedbacksWhereQuery } from './queries/getMentorFeedbacksWhereQuery';
import { MentorFeedbackRepository } from '../../database/repository/mentorFeedback.repository';
import { ReservationRepository } from '../../database/repository/reservation.repository';

@Injectable()
export class MentorFeedbackService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly mentorFeedbackRepository: MentorFeedbackRepository,
  ) {}

  async findManyMentorFeedbacks(
    query: GetMentorFeedbacksQueryDto,
  ): Promise<MentorFeedbackResponseDto[]> {
    return await this.mentorFeedbackRepository.findMany(
      query.mentor_id,
      query.mentee_id,
      query.reservation_id,
      query.take,
      query.page,
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
