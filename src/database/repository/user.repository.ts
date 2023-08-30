import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UserGetResponseDto } from '../../models/user/dto/response/userGetResponse.dto';
import { UserSelectQuery } from '../../models/user/queries/userSelect.query';
import { UserCreatePayloadDto } from '../../models/user/dto/request/userCreatePayload.dto';
import { UserUpdatePayloadDto } from '../../models/user/dto/request/userUpdatePayload.dto';
import { UserReservationGetDto } from '../../models/user/dto/response/userReservationGet.dto';
import { ReservationStatus } from '@prisma/client';
import { ReservationSelectQuery } from '../../models/reservation/queries/reservationSelect.query';

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

  async findUserReservation(
    id: number,
    take: number,
    page: number,
    as_mentor: boolean,
    as_mentee: boolean,
    active: boolean,
  ): Promise<UserReservationGetDto> {
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
          { status: ReservationStatus.MENTEE_FEEDBACK },
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
