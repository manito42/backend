import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { ReservationStatus, UserRole } from '@prisma/client';
import { ReservationSelectQuery } from '../../models/reservation/queries/reservationSelect.query';
import {
  ReservationCompleteAsMenteePayloadDto,
  ReservationCompleteAsMentorPayloadDto,
  ReservationUpdatePayloadDto,
} from '../../models/reservation/dto/request/reservationUpdatePayload.dto';
import { ReservationGetResponseDto } from '../../models/reservation/dto/response/reservationGetResponse.dto';
import { getReservationsWhereQuery } from '../../models/reservation/queries/getReservationsWhereQuery';
import { ReservationCreatePayloadDto } from '../../models/reservation/dto/request/reservationCreatePayload.dto';
import { SelectAllType } from '../../common/constants/selectAll.type';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(
    category_id: number | SelectAllType,
    hashtag_id: number | SelectAllType,
    take: number,
    page: number,
  ): Promise<Array<ReservationGetResponseDto>> {
    return this.prismaService.reservation.findMany({
      take: take,
      skip: page * take,
      where: getReservationsWhereQuery(hashtag_id, category_id),
      select: ReservationSelectQuery,
    });
  }

  async findById(id: number): Promise<ReservationGetResponseDto> {
    return this.prismaService.reservation.findUnique({
      where: { id: id },
      select: ReservationSelectQuery,
    });
  }

  async create(payload: ReservationCreatePayloadDto): Promise<ReservationGetResponseDto> {
    const { menteeId, mentorId } = payload;
    if (menteeId === mentorId) throw new BadRequestException('can not reserve myself');
    const mentorProfile = await this.prismaService.mentorProfile.findUnique({
      where: { userId: mentorId },
    });
    if (!mentorProfile || mentorProfile.isHide)
      throw new BadRequestException('requested mentorID is not available');
    const existMentoringCount = await this.prismaService.reservation.count({
      where: {
        mentorId: mentorId,
        menteeId: menteeId,
        OR: [{ status: 'ACCEPT' }, { status: 'REQUEST' }],
      },
    });
    if (existMentoringCount !== 0) throw new ConflictException('already exists active reservation');

    return this.prismaService.reservation.create({
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
  }

  async update(
    id: number,
    payload: ReservationUpdatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    return this.prismaService.reservation.update({
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
    return this.prismaService.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });
      /**
       * NOTE: 예약은 REQUEST/ACCEPT 상태일 때만 취소할 수 있다.
       * */
      if (
        !reservation ||
        (reservation.status !== ReservationStatus.REQUEST &&
          reservation.status !== ReservationStatus.ACCEPT)
      )
        throw new BadRequestException('invalid reservation for accept');
      /**
       * NOTE: ACCEPT 상태의 예약은 멘토 혹은 Admin 만 취소할 수 있다.
       */
      if (
        reservation.status === ReservationStatus.ACCEPT &&
        role !== UserRole.ADMIN &&
        reservation.mentorId !== userId
      )
        throw new UnauthorizedException('user is not mentor of this reservation');
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.CANCEL },
        select: ReservationSelectQuery,
      });
    });
  }

  async acceptReservation(reservationId: number, userId: number, role: string) {
    return this.prismaService.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUniqueOrThrow({
        where: { id: reservationId },
      });
      if (!reservation || reservation.status !== ReservationStatus.REQUEST)
        throw new BadRequestException('invalid reservation for accept');
      if (role !== UserRole.ADMIN && reservation.mentorId !== userId)
        throw new UnauthorizedException('user is not mentor of this reservation');
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.ACCEPT },
        select: ReservationSelectQuery,
      });
    });
  }
  async completeReservationByMentee(
    reservationId: number,
    userId: number,
    role: string,
    payload: ReservationCompleteAsMenteePayloadDto,
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });
      if (!reservation || reservation.status !== ReservationStatus.ACCEPT)
        throw new BadRequestException('invalid reservation for mentee_completion');
      if (role !== UserRole.ADMIN && reservation.menteeId !== userId)
        throw new UnauthorizedException('user is not mentee of this reservation');
      await prisma.menteeFeedback.create({
        data: {
          reservationId: reservationId,
          menteeId: reservation.menteeId,
          mentorId: reservation.mentorId,
          content: payload.content,
        },
      });
      await prisma.user.update({
        where: { id: reservation.menteeId },
        data: {
          mentoringCount: { increment: 1 },
        },
      });
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.MENTEE_FEEDBACK },
        select: ReservationSelectQuery,
      });
    });
  }

  async completeReservationByMentor(
    reservationId: number,
    userId: number,
    role: string,
    payload: ReservationCompleteAsMentorPayloadDto,
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });
      if (!reservation || reservation.status !== ReservationStatus.ACCEPT)
        throw new BadRequestException('invalid reservation for mentor_completion');
      if (role !== UserRole.ADMIN && reservation.mentorId !== userId)
        throw new UnauthorizedException('user is not mentor of this reservation');
      await prisma.mentorFeedback.create({
        data: {
          reservationId: reservationId,
          menteeId: reservation.menteeId,
          mentorId: reservation.mentorId,
        },
      });
      await prisma.mentorProfile.update({
        where: { userId: reservation.mentorId },
        data: {
          mentoringCount: { increment: 1 },
        },
      });
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.DONE },
        select: ReservationSelectQuery,
      });
    });
  }
}
