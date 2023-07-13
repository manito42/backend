import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { ReservationGetResponseDto } from './dto/response/reservationGetResponse.dto';
import { ReservationSelectQuery } from './queries/reservationSelect.query';
import { ReservationCreatePayloadDto } from './dto/request/reservationCreatePayload.dto';
import { ReservationUpdatePayloadDto } from './dto/request/reservationUpdatePayload.dto';
import { GetReservationQueryDto } from './dto/request/reservationQuery.dto';
import { getReservationsWhereQuery } from './queries/getReservationsWhereQuery';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(payload: ReservationCreatePayloadDto) {
    if (payload.menteeId === payload.mentorId) throw new BadRequestException();
    const mentor = await this.prisma.user.findUnique({ where: { id: payload.mentorId } });
    if (!mentor || !mentor.isMentor) throw new BadRequestException();

    return this.prisma.reservation.create({
      data: {
        menteeId: payload.menteeId,
        mentorId: payload.mentorId,
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
}
