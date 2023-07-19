import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationGetResponseDto } from './dto/response/reservationGetResponse.dto';
import { ReservationCreatePayloadDto } from './dto/request/reservationCreatePayload.dto';
import {
  ReservationCompleteAsMenteePayloadDto,
  ReservationCompleteAsMentorPayloadDto,
  ReservationUpdatePayloadDto,
} from './dto/request/reservationUpdatePayload.dto';
import { GetReservationQueryDto } from './dto/request/reservationQuery.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { GetUserId } from '../../common/decorators/getUserId.decorator';
import { ReservationStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../database/services/prisma.service';
import { ReservationSelectQuery } from './queries/reservationSelect.query';
import { GetUserRole } from '../../common/decorators/getUserRole.decorator';

@Controller('/reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * NOTE: 일반 사용자가 Reservation 에 대해서 조회할 이유가 없기 때문에 ADMIN 전용으로 함.
   * @access >= ADMIN
   */
  @Get('/')
  @UseGuards(JwtGuard)
  async getReservations(
    @GetUserRole() role: UserRole,
    @Query() query: GetReservationQueryDto,
  ): Promise<Array<ReservationGetResponseDto>> {
    if (role !== UserRole.ADMIN) throw new UnauthorizedException();
    return await this.reservationService.findMany(query);
  }

  /**
   * NOTE: concurrency 상황에서 동시에 두 개의 record가 기록될 가능성 있음.
   * 해당 경우, 활성된 reservation이 두 개 이상 발생할 수 있다.
   * 현재 설계의 경우 여러 개 Reservation 이 있을 때 특별한 문제가 발생하지 않으므로, 따로 처리하지 않았다.
   * @access >= USER
   */
  @Post('/')
  @UseGuards(JwtGuard)
  async create(
    @GetUserId() userId: number,
    @GetUserRole() role: UserRole,
    @Body() payload: ReservationCreatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    if (role !== UserRole.ADMIN && payload.menteeId !== userId)
      throw new UnauthorizedException('menteeID is not matched with session userID');
    return await this.reservationService.create(payload);
  }

  /**
   * @access >= ADMIN
   */
  @Patch('/:id')
  @UseGuards(JwtGuard)
  async update(
    @GetUserId() userId: number,
    @GetUserRole() role: UserRole,
    @Param('id') id: number,
    @Body() payload: ReservationUpdatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    if (id < 0) throw new BadRequestException('id is invalid');
    if (role !== UserRole.ADMIN) throw new UnauthorizedException('only for admin');
    return await this.reservationService.update(id, payload);
  }

  /**
   * @access >= OWNER
   */
  @Get('/:id')
  @UseGuards(JwtGuard)
  async getReservationById(
    @GetUserRole() role: UserRole,
    @GetUserId() userId: number,
    @Param('id') id: number,
  ): Promise<ReservationGetResponseDto> {
    if (id < 0) throw new BadRequestException('id is invalid');
    const reservation = await this.reservationService.findById(id);
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
   * @access >= OWNER
   */
  @Patch('/:id/cancel')
  @UseGuards(JwtGuard)
  async cancel(
    @Param('id') reservationId: number,
    @GetUserId() userId: number,
    @GetUserRole() role: UserRole,
  ): Promise<ReservationGetResponseDto> {
    if (reservationId < 0) throw new BadRequestException('invalid id');
    return await this.prismaService.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUniqueOrThrow({
        where: { id: reservationId },
      });
      if (!reservation || reservation.status !== ReservationStatus.REQUEST)
        throw new BadRequestException('invalid reservation for cancel');
      if (
        role !== UserRole.ADMIN &&
        reservation.menteeId !== userId &&
        reservation.mentorId !== userId
      )
        throw new UnauthorizedException('user is not related with reservation');
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.CANCEL },
        select: ReservationSelectQuery,
      });
    });
  }

  /**
   * @access >= OWNER
   */
  @Patch('/:id/accept')
  @UseGuards(JwtGuard)
  async accept(
    @Param('id') reservationId: number,
    @GetUserId() userId: number,
    @GetUserRole() role: UserRole,
  ): Promise<ReservationGetResponseDto> {
    if (reservationId < 0) throw new BadRequestException('invalid id');
    return await this.prismaService.$transaction(async (prisma) => {
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
   * @access >= OWNER
   */
  @Patch('/:id/mentor_completion')
  @UseGuards(JwtGuard)
  async completeReservationByMentor(
    @Param('id') reservationId: number,
    @GetUserId() userId: number,
    @GetUserRole() role: UserRole,
    @Body() payload: ReservationCompleteAsMentorPayloadDto,
  ): Promise<ReservationGetResponseDto> {
    if (reservationId < 0) throw new BadRequestException('invalid id');
    /* transaction REPEATABLE READ */
    return await this.prismaService.$transaction(async (prisma) => {
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
          rating: payload.rating,
        },
      });
      await prisma.mentorProfile.update({
        where: { userId: reservation.mentorId },
        data: {
          mentoringCount: { increment: 1 },
        },
      });
      await prisma.user.update({
        where: { id: reservation.menteeId },
        data: {
          ratingSum: { increment: payload.rating },
        },
      });
      return prisma.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.PENDING },
        select: ReservationSelectQuery,
      });
    });
  }

  /**
   * @access >= OWNER
   */
  @Patch('/:id/mentee_completion')
  @UseGuards(JwtGuard)
  async completeReservationByMentee(
    @Param('id') reservationId: number,
    @GetUserId() userId: number,
    @GetUserRole() role: UserRole,
    @Body() payload: ReservationCompleteAsMenteePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    if (reservationId < 0) throw new BadRequestException('invalid id');
    /* transaction REPEATABLE READ */
    return await this.prismaService.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });
      if (!reservation || reservation.status !== ReservationStatus.PENDING)
        throw new BadRequestException('invalid reservation for mentee_completion');
      if (role !== UserRole.ADMIN && reservation.menteeId !== userId)
        throw new UnauthorizedException('user is not mentee of this reservation');
      await prisma.menteeFeedback.create({
        data: {
          reservationId: reservationId,
          menteeId: reservation.menteeId,
          mentorId: reservation.mentorId,
          rating: payload.rating,
          content: payload.content,
        },
      });
      await prisma.mentorProfile.update({
        where: { userId: reservation.mentorId },
        data: {
          ratingSum: { increment: payload.rating },
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
        data: { status: ReservationStatus.COMPLETE },
        select: ReservationSelectQuery,
      });
    });
  }
}
