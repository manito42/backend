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
  ReservationCancelPayloadDto,
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

  /**
   * @brief 예약을 생성한다.
   * @description 요청한 멘토의 프로필이 존재하는지 확인하고, 예약을 생성한다.
   * @param ReservationCreatePayloadDto
   * @return ReservationGetResponseDto
   * @transaction
   * 	- A 카테고리와 해시태그 기반 멘토의 프로필이 존재하는지 확인한다.
   * 	- B 예약이 이미 존재하는지 확인한다.
   * 	- C 카테고리와 해시태그로 예약을 생성한다.
   * 	A<->C 사이에 시간이 지나면 멘토의 프로필이 변경될 수 있으므로,
   * 	트랜잭션으로 묶어서 예약을 생성한다.
   */
  async create(payload: ReservationCreatePayloadDto): Promise<ReservationGetResponseDto> {
    const { menteeId, mentorId } = payload;
    // 스스로 예약을 할 수 없다.
    if (menteeId === mentorId) throw new BadRequestException('can not reserve myself');
    return await this.prismaService.$transaction(async (prisma) => {
      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: {
          userId: mentorId,
          isHide: false,
          categories: {
            some: {
              id: payload.categoryId,
            },
          },
          hashtags: {
            some: {
              id: {
                in: payload.hashtags.map((hashtag) => hashtag.id),
              },
            },
          },
        },
        include: {
          hashtags: true,
        },
      });

      //find many로 찾아서 mentorProfile을 중심으로 category와 hashtag를 검사한다.
      //mentorProfile이 없거나, mentorProfile의 길이와 payload의 hashtag의 길이가 다르면 예외처리한다.
      if (!mentorProfile) throw new BadRequestException('request is not vaild');

      // //payload hashtag에 대해 mentorProfile hashtag에 없으면 예외처리한다.
      const isAllHashtagExist = payload.hashtags.every((hashtag) =>
        mentorProfile.hashtags.some((profileHashtag) => profileHashtag.id === hashtag.id),
      );
      if (!isAllHashtagExist) throw new BadRequestException('request is not vaild');

      const existMentoringCount = await prisma.reservation.count({
        where: {
          mentorId: mentorId,
          menteeId: menteeId,
          OR: [
            { status: ReservationStatus.REQUEST },
            { status: ReservationStatus.ACCEPT },
            { status: ReservationStatus.MENTEE_CHECKED },
          ],
        },
      });
      if (existMentoringCount !== 0)
        throw new ConflictException('already exists active reservation');

      return await prisma.reservation.create({
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

  async cancelReservation(
    reservationId: number,
    userId: number,
    role: string,
    payload: ReservationCancelPayloadDto,
  ) {
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

      await prisma.cancelReason.create({
        data: {
          content: payload.content,
          requestedUserId: userId,
          reservationId: reservationId,
        },
      });

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
          rating: payload.rating,
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
