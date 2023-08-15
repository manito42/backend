import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { UserSelectQuery } from './queries/userSelect.query';
import { UserCreatePayloadDto } from './dto/request/userCreatePayload.dto';
import { UserUpdatePayloadDto } from './dto/request/userUpdatePayload.dto';
import { UserGetResponseDto } from './dto/response/userGetResponse.dto';
import { GetUserQueryDto } from './dto/request/userQuery.dto';
import { ReservationStatus } from '@prisma/client';
import { UserReservationGetDto } from './dto/response/userReservationGet.dto';
import { GetUserReservationQueryDto } from './dto/request/userReservationQuery.dto';
import { ReservationSelectQuery } from '../reservation/queries/reservationSelect.query';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(query: GetUserQueryDto): Promise<Array<UserGetResponseDto>> {
    const { take, page } = query;
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
  async create(payload: UserCreatePayloadDto): Promise<UserGetResponseDto> {
    return await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: payload,
      });
      await prisma.mentorProfile.create({ data: { userId: user.id } });
      return prisma.user.findUnique({ where: { id: user.id }, select: UserSelectQuery });
    });
  }

  async update(id: number, payload: UserUpdatePayloadDto): Promise<UserGetResponseDto> {
    // we have to check fail conditions here
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: payload,
      select: UserSelectQuery,
    });
  }

  async findUserReservation(
    id: number,
    query: GetUserReservationQueryDto,
  ): Promise<UserReservationGetDto> {
    const { take, page, as_mentor, as_mentee, active } = query;
    let menteeReservations;
    let mentorReservations;
    if (as_mentee) {
      let whereQuery = { menteeId: id };
      if (active)
        whereQuery['OR'] = [
          { status: ReservationStatus.REQUEST },
          { status: ReservationStatus.ACCEPT },
        ];
      menteeReservations = await this.prisma.reservation.findMany({
        where: whereQuery,
        select: ReservationSelectQuery,
        take: take,
        skip: take * page,
        orderBy: {
          updatedAt: 'desc',
        },
      });
    }
    if (as_mentor) {
      let whereQuery = { mentorId: id };
      if (active)
        whereQuery['OR'] = [
          { status: ReservationStatus.REQUEST },
          { status: ReservationStatus.ACCEPT },
          { status: ReservationStatus.PENDING },
        ];
      mentorReservations = await this.prisma.reservation.findMany({
        where: whereQuery,
        select: ReservationSelectQuery,
        take: take,
        skip: take * page,
        orderBy: {
          updatedAt: 'desc',
        },
      });
    }
    return {
      menteeReservations,
      mentorReservations,
    };
  }
}
