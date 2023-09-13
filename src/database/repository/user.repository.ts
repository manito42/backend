import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UserGetResponseDto } from '../../models/user/dto/response/userGetResponse.dto';
import { UserSelectQuery } from '../../models/user/queries/userSelect.query';
import { UserCreatePayloadDto } from '../../models/user/dto/request/userCreatePayload.dto';
import { UserUpdatePayloadDto } from '../../models/user/dto/request/userUpdatePayload.dto';
import { ReservationStatus } from '@prisma/client';
import { ReservationSelectQuery } from '../../models/reservation/queries/reservationSelect.query';
import { UserReservationPaginationResponseDto } from 'src/models/user/dto/response/userReservationPaginationResponse.dto';
import {
  getUserReservationsAsMenteeWhereQuery,
  getUserReservationsAsMentorWhereQuery,
} from 'src/models/user/queries/userReservationWhere.query';
import { UserReservationGetDto } from 'src/models/user/dto/response/userReservationGet.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(take: number, page: number): Promise<Array<UserGetResponseDto>> {
    return this.prisma.user.findMany({
      skip: take * page,
      take: take,
      select: UserSelectQuery,
    });
  }

  async findById(id: number): Promise<UserGetResponseDto> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: UserSelectQuery,
    });
  }

  async findByEmail(email: string): Promise<UserGetResponseDto> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: UserSelectQuery,
    });
  }

  async findByNickname(nickname: string): Promise<UserGetResponseDto> {
    return this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      select: UserSelectQuery,
    });
  }

  // only for admin
  async create(data: UserCreatePayloadDto): Promise<UserGetResponseDto> {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: data,
      });
      await prisma.mentorProfile.create({ data: { userId: user.id } });
      return prisma.user.findUnique({ where: { id: user.id }, select: UserSelectQuery });
    });
  }

  async update(id: number, data: UserUpdatePayloadDto): Promise<UserGetResponseDto> {
    // we have to check fail conditions here
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: data,
      select: UserSelectQuery,
    });
  }

  /**
   * @brief get reservation(mentee, mentor) by user id
   *
   * @param id: number
   * @param take: number
   * @param page: number
   * @param status: ReservationStatus[] : 데이터베이스에서 가져올 예약의 상태
   * @return
   */
  async findUserReservation(
    id: number,
    take: number,
    page: number,
    status: ReservationStatus[],
  ): Promise<UserReservationGetDto> {
    const menteeReservations = await this.prisma.reservation.findMany({
      where: getUserReservationsAsMenteeWhereQuery(id, status),
      select: ReservationSelectQuery,
      take: take,
      skip: take * page,
      orderBy: {
        updatedAt: 'desc',
      },
    });
    const mentorReservations = await this.prisma.reservation.findMany({
      where: getUserReservationsAsMentorWhereQuery(id, status),
      select: ReservationSelectQuery,
      take: take,
      skip: take * page,
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return {
      menteeReservations,
      mentorReservations,
    };
  }

  async findUserReservationAsMentor(
    id: number,
    take: number,
    page: number,
    status: ReservationStatus[],
  ): Promise<UserReservationPaginationResponseDto> {
    const whereQuery = getUserReservationsAsMentorWhereQuery(id, status);
    const totalCount = await this.prisma.reservation.count({
      where: whereQuery,
    });
    const totalPage = Math.ceil(totalCount / take) - 1;

    return {
      content: await this.prisma.reservation.findMany({
        where: whereQuery,
        select: ReservationSelectQuery,
        take: take,
        skip: take * page,
        orderBy: {
          updatedAt: 'desc',
        },
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

  async findUserReservationAsMentee(
    id: number,
    take: number,
    page: number,
    status: ReservationStatus[],
  ): Promise<UserReservationPaginationResponseDto> {
    const whereQuery = getUserReservationsAsMenteeWhereQuery(id, status);
    const totalCount = await this.prisma.reservation.count({
      where: whereQuery,
    });
    const totalPage = Math.ceil(totalCount / take) - 1;

    return {
      content: await this.prisma.reservation.findMany({
        where: whereQuery,
        select: ReservationSelectQuery,
        take: take,
        skip: take * page,
        orderBy: {
          updatedAt: 'desc',
        },
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
}
