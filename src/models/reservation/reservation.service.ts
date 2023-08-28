import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { ReservationGetResponseDto } from './dto/response/reservationGetResponse.dto';
import { ReservationSelectQuery } from './queries/reservationSelect.query';
import { ReservationCreatePayloadDto } from './dto/request/reservationCreatePayload.dto';
import {
  ReservationCompleteAsMenteePayloadDto,
  ReservationCompleteAsMentorPayloadDto,
  ReservationUpdatePayloadDto,
} from './dto/request/reservationUpdatePayload.dto';
import { GetReservationQueryDto } from './dto/request/reservationQuery.dto';
import { getReservationsWhereQuery } from './queries/getReservationsWhereQuery';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reservationRepository: ReservationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findMany(query: GetReservationQueryDto): Promise<Array<ReservationGetResponseDto>> {
    const { category_id, hashtag_id, take, page } = query;
    return this.prisma.reservation.findMany({
      take: take,
      skip: page * take,
      where: getReservationsWhereQuery(hashtag_id, category_id),
      select: ReservationSelectQuery,
    });
  }

  async findById(id: number): Promise<ReservationGetResponseDto> {
    return this.prisma.reservation.findUnique({
      where: { id: id },
      select: ReservationSelectQuery,
    });
  }

  /**
   * @description 멘티가 멘토에게 예약을 요청하는 API
   * - 멘토가 멘티에게 예약을 요청하는 경우는 없다.
   * - 멘토가 존재하지 않거나, 멘토가 숨김 상태인 경우 예약을 생성할 수 없다.
   * - 현재 진행중(ACCEPT, REQUEST)인 예약이 있으면 예약을 생성할 수 없다.
   * @param payload: ReservationCreatePayloadDto
   * @returns ReservationGetResponseDto
   * */
  async create(payload: ReservationCreatePayloadDto): Promise<ReservationGetResponseDto> {
    const { menteeId, mentorId } = payload;
    if (menteeId === mentorId) throw new BadRequestException('can not reserve myself');
    const mentorProfile = await this.prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
    });
    if (!mentorProfile || mentorProfile.isHide)
      throw new BadRequestException('requested mentorID is not available');
    const existMentoringCount = await this.prisma.reservation.count({
      where: {
        mentorId: mentorId,
        menteeId: menteeId,
        OR: [{ status: 'ACCEPT' }, { status: 'REQUEST' }],
      },
    });
    if (existMentoringCount !== 0) throw new ConflictException('already exists active reservation');

    const result = await this.prisma.reservation.create({
      data: {
        menteeId: menteeId,
        mentorId: mentorId,
        categoryId: payload.categoryId,
        requestMessage: payload.requestMessage,
        hashtags: {
          connect: payload.hashtags,
        },
      },
      select: ReservationSelectQuery,
    });

    const mentor = await this.prisma.user.findUnique({ where: { id: result.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: result.menteeId } });
    this.eventEmitter.emit('reservation.request', {
      mentor,
      mentee,
      reservation: result,
    });
    return result;
  }

  async update(
    id: number,
    payload: ReservationUpdatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    return this.prisma.reservation.update({
      where: {
        id: id,
      },
      data: {
        requestMessage: payload.requestMessage,
        status: payload.status,
        categoryId: payload.categoryId,
        hashtags: {
          set: payload.hashtags,
        },
      },
      select: ReservationSelectQuery,
    });
  }

  async cancelReservation(reservationId: number, userId: number, role: string) {
    const result = await this.reservationRepository.cancelReservation(reservationId, userId, role);
    const mentor = await this.prisma.user.findUnique({ where: { id: result.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: result.menteeId } });

    this.eventEmitter.emit('reservation.cancel', { mentor, mentee, reservation: result });
    return result;
  }

  async acceptReservation(reservationId: number, userId: number, role: string) {
    const result = await this.reservationRepository.acceptReservation(reservationId, userId, role);
    const mentor = await this.prisma.user.findUnique({ where: { id: result.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: result.menteeId } });

    this.eventEmitter.emit('reservation.accept', { mentor, mentee, reservation: result });
    return result;
  }
  async menteeCompletion(
    reservationId: number,
    userId: number,
    role: string,
    payload: ReservationCompleteAsMenteePayloadDto,
  ) {
    const result = await this.reservationRepository.completeReservationByMentee(
      reservationId,
      userId,
      role,
      payload,
    );
    const mentor = await this.prisma.user.findUnique({ where: { id: result.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: result.menteeId } });

    this.eventEmitter.emit('reservation.menteeCompletion', { mentor, mentee, reservation: result });
    return result;
  }

  async mentorCompletion(
    reservationId: number,
    userId: number,
    role: string,
    payload: ReservationCompleteAsMentorPayloadDto,
  ) {
    const result = await this.reservationRepository.completeReservationByMentor(
      reservationId,
      userId,
      role,
      payload,
    );
    const mentor = await this.prisma.user.findUnique({ where: { id: result.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: result.menteeId } });

    this.eventEmitter.emit('reservation.mentorCompletion', { mentor, mentee, reservation: result });
    return result;
  }
}
