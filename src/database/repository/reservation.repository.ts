import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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
import { ReservationPaginationResponseDto } from 'src/models/reservation/dto/response/reservationPaginationResponse.dto';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(
    category_id: number | SelectAllType,
    hashtag_id: number | SelectAllType,
    take: number,
    page: number,
  ): Promise<ReservationPaginationResponseDto> {
    const totalCount = await this.prismaService.reservation.count({
      where: getReservationsWhereQuery(hashtag_id, category_id),
    });
    const totalPage = Math.ceil(totalCount / take) - 1;

    return {
      content: await this.prismaService.reservation.findMany({
        take: take,
        skip: page * take,
        where: getReservationsWhereQuery(hashtag_id, category_id),
        select: ReservationSelectQuery,
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
       * NOTE: 예약은 REQUEST/ACCEPT/MENTEE_CHECKED 상태일 때만 취소할 수 있다.
       * */
      if (
        !reservation ||
        (reservation.status !== ReservationStatus.REQUEST &&
          reservation.status !== ReservationStatus.ACCEPT &&
          reservation.status !== ReservationStatus.MENTEE_CHECKED)
      )
        throw new BadRequestException('invalid reservation for accept');

      /**
       * NOTE: ACCEPT/MENTEE_CHECKED 상태의 예약은 멘토 혹은 Admin 만 취소할 수 있다.
       */
      if (
        (reservation.status === ReservationStatus.ACCEPT ||
          reservation.status === ReservationStatus.MENTEE_CHECKED) &&
        reservation.mentorId !== userId &&
        role !== UserRole.ADMIN
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

  /**
   * @param reservationId
   *   - 예약 ID
   * @param userId
   *   - 요청한 유저 ID
   * @param role
   *   - 요청한 유저의 Role
   * */
  async checkReservation(
    reservationId: number,
    userId: number,
    role: string,
  ): Promise<ReservationGetResponseDto> {
    return this.prismaService.$transaction(async (prisma) => {
      const reservation = await this.prismaService.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });
      // reservation이 없는 경우
      if (!reservation) throw new NotFoundException('not exist reservation');

      // check는 ACCEPT 상태의 예약만 가능
      if (reservation.status !== ReservationStatus.ACCEPT)
        throw new BadRequestException('invalid reservation for check');

      // check는 예약한 멘티 혹은 Admin 만 가능
      if (reservation.menteeId !== userId && role !== 'ADMIN')
        throw new UnauthorizedException('invalid user');

      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.MENTEE_CHECKED },
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
      if (
        !reservation ||
        (reservation.status !== ReservationStatus.ACCEPT &&
          reservation.status !== ReservationStatus.MENTEE_CHECKED)
      )
        throw new BadRequestException('invalid reservation for mentee_completion');
      if (role !== UserRole.ADMIN && reservation.menteeId !== userId)
        throw new UnauthorizedException('user is not mentee of this reservation');
      await prisma.menteeFeedback.create({
        data: {
          reservationId: reservationId,
          menteeId: reservation.menteeId,
          mentorId: reservation.mentorId,
          content: payload.content,
          rating: payload.rating,
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
      if (!reservation || reservation.status !== ReservationStatus.MENTEE_FEEDBACK)
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
