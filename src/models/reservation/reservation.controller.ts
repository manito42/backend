import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { UserRole } from '@prisma/client';
import { GetUserRole } from '../../common/decorators/getUserRole.decorator';

@Controller('/reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

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
    return await this.reservationService.findManyReservation(query);
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
    return await this.reservationService.createReservation(payload);
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
    return await this.reservationService.updateReservation(id, payload);
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
    return await this.reservationService.findReservationById(id, role, userId);
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
    /**
     * @TODO: this validation should be done in pipes
     * */
    if (reservationId < 0) throw new BadRequestException('invalid id');
    return await this.reservationService.cancelReservation(reservationId, userId, role);
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
    /**
     * @TODO: this validation should be done in pipes
     * */
    if (reservationId < 0) throw new BadRequestException('invalid id');
    return await this.reservationService.acceptReservation(reservationId, userId, role);
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
    return await this.reservationService.mentorCompletion(reservationId, userId, role, payload);
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
    return await this.reservationService.menteeCompletion(reservationId, userId, role, payload);
  }
}
