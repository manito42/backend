import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { ReservationStatus, UserRole } from '@prisma/client';
import { ReservationSelectQuery } from '../../models/reservation/queries/reservationSelect.query';
import {
  ReservationCompleteAsMenteePayloadDto,
  ReservationCompleteAsMentorPayloadDto,
} from '../../models/reservation/dto/request/reservationUpdatePayload.dto';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async cancelReservation(reservationId: number, userId: number, role: string) {
    return this.prismaService.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUniqueOrThrow({
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
        data: { status: ReservationStatus.ACCEPT },
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
}
