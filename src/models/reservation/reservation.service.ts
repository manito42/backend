import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { ReservationGetResponseDto } from './dto/response/reservationGetResponse.dto';
import { ReservationCreatePayloadDto } from './dto/request/reservationCreatePayload.dto';
import {
  ReservationCompleteAsMenteePayloadDto,
  ReservationCompleteAsMentorPayloadDto,
  ReservationUpdatePayloadDto,
} from './dto/request/reservationUpdatePayload.dto';
import { GetReservationQueryDto } from './dto/request/reservationQuery.dto';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRole } from '@prisma/client';
import {
  RESERVATION_ACCEPT,
  RESERVATION_CANCEL,
  RESERVATION_MENTEE_COMPLETION,
  RESERVATION_REQUEST,
} from '../../common/constants/notification.event';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reservationRepository: ReservationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findManyReservation(
    query: GetReservationQueryDto,
  ): Promise<Array<ReservationGetResponseDto>> {
    return await this.reservationRepository.findMany(query);
  }

  async findReservationById(
    id: number,
    role: string,
    userId: number,
  ): Promise<ReservationGetResponseDto> {
    const reservation = await this.reservationRepository.findById(id);

    if (!reservation) throw new NotFoundException('not exist reservation');
    if (
      role !== UserRole.ADMIN &&
      userId !== reservation.menteeId &&
      userId !== reservation.mentorId
    )
      throw new UnauthorizedException();
    return reservation;
  }

  /**
   * @description 멘티가 멘토에게 예약을 요청하는 API
   * - 멘토가 멘티에게 예약을 요청하는 경우는 없다.
   * - 멘토가 존재하지 않거나, 멘토가 숨김 상태인 경우 예약을 생성할 수 없다.
   * - 현재 진행중(ACCEPT, REQUEST)인 예약이 있으면 예약을 생성할 수 없다.
   * @param payload: ReservationCreatePayloadDto
   * @returns ReservationGetResponseDto
   * */
  async createReservation(
    payload: ReservationCreatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    const createResult = await this.reservationRepository.create(payload);

    const mentor = await this.prisma.user.findUnique({ where: { id: createResult.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: createResult.menteeId } });

    this.eventEmitter.emit(RESERVATION_REQUEST, {
      mentor,
      mentee,
      reservation: createResult,
    });
    return createResult;
  }

  async updateReservation(
    id: number,
    payload: ReservationUpdatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    return await this.reservationRepository.update(id, payload);
  }

  async cancelReservation(reservationId: number, userId: number, role: string) {
    const result = await this.reservationRepository.cancelReservation(reservationId, userId, role);
    const mentor = await this.prisma.user.findUnique({ where: { id: result.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: result.menteeId } });

    this.eventEmitter.emit(RESERVATION_CANCEL, { mentor, mentee, reservation: result });
    return result;
  }

  async acceptReservation(reservationId: number, userId: number, role: string) {
    const result = await this.reservationRepository.acceptReservation(reservationId, userId, role);
    const mentor = await this.prisma.user.findUnique({ where: { id: result.mentorId } });
    const mentee = await this.prisma.user.findUnique({ where: { id: result.menteeId } });

    this.eventEmitter.emit(RESERVATION_ACCEPT, { mentor, mentee, reservation: result });
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

    this.eventEmitter.emit(RESERVATION_MENTEE_COMPLETION, { mentor, mentee, reservation: result });
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
