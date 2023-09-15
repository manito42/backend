import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ReservationGetResponseDto } from './dto/response/reservationGetResponse.dto';
import { ReservationCreatePayloadDto } from './dto/request/reservationCreatePayload.dto';
import {
  ReservationCompleteAsMenteePayloadDto,
  ReservationCompleteAsMentorPayloadDto,
  ReservationUpdatePayloadDto,
} from './dto/request/reservationUpdatePayload.dto';
import { ReservationRepository } from '../../database/repository/reservation.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRole } from '@prisma/client';
import {
  RESERVATION_ACCEPT,
  RESERVATION_CANCEL,
  RESERVATION_MENTEE_COMPLETION,
  RESERVATION_REQUEST,
} from '../../common/constants/notification.event';
import { UserRepository } from '../../database/repository/user.repository';
import { SelectAllType } from '../../common/constants/selectAll.type';
import { ReservationPaginationResponseDto } from './dto/response/reservationPaginationResponse.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findManyReservation(
    category_id: number | SelectAllType,
    hashtag_id: number | SelectAllType,
    take: number,
    page: number,
  ): Promise<ReservationPaginationResponseDto> {
    return await this.reservationRepository.findMany(category_id, hashtag_id, take, page);
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
   * @returns ReservationGetResponseDto
   * @param payload
   * */
  async createReservation(
    payload: ReservationCreatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    const createResult = await this.reservationRepository.create(payload);
    const mentor = await this.userRepository.findById(createResult.mentorId);
    const mentee = await this.userRepository.findById(createResult.menteeId);

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
    const mentor = await this.userRepository.findById(result.mentorId);
    const mentee = await this.userRepository.findById(result.menteeId);

    this.eventEmitter.emit(RESERVATION_CANCEL, { mentor, mentee, reservation: result });
    return result;
  }

  async acceptReservation(reservationId: number, userId: number, role: string) {
    const result = await this.reservationRepository.acceptReservation(reservationId, userId, role);
    const mentor = await this.userRepository.findById(result.mentorId);
    const mentee = await this.userRepository.findById(result.menteeId);

    this.eventEmitter.emit(RESERVATION_ACCEPT, { mentor, mentee, reservation: result });
    return result;
  }

  /**
   * @description 멘티가 예약을 확인하는 API
   * - 멘티가 멘토에게 예약을 요청한 경우, 멘토가 수락하면 예약이 생성된다.
   * - 수락된 예약은 멘티가 확인을 했느냐/하지 않았냐에 따라 달라짐.
   * */
  async checkReservationByMentee(
    reservationId: number,
    userId: number,
    role: string,
  ): Promise<ReservationGetResponseDto> {
    return await this.reservationRepository.checkReservation(reservationId, userId, role);
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
    const mentor = await this.userRepository.findById(result.mentorId);
    const mentee = await this.userRepository.findById(result.menteeId);

    this.eventEmitter.emit(RESERVATION_MENTEE_COMPLETION, { mentor, mentee, reservation: result });
    return result;
  }

  async mentorCompletion(
    reservationId: number,
    userId: number,
    role: string,
    payload: ReservationCompleteAsMentorPayloadDto,
  ) {
    return await this.reservationRepository.completeReservationByMentor(
      reservationId,
      userId,
      role,
      payload,
    );
  }
}
