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
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationGetResponseDto } from './dto/response/reservationGetResponse.dto';
import { ReservationCreatePayloadDto } from './dto/request/reservationCreatePayload.dto';
import { ReservationUpdatePayloadDto } from './dto/request/reservationUpdatePayload.dto';
import { GetReservationQueryDto } from './dto/request/reservationQuery.dto';

@Controller('/reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('/')
  async getReservations(
    @Query() query: GetReservationQueryDto,
  ): Promise<Array<ReservationGetResponseDto>> {
    return await this.reservationService.findMany(query);
  }

  @Post('/')
  async create(@Body() payload: ReservationCreatePayloadDto): Promise<ReservationGetResponseDto> {
    return await this.reservationService.create(payload);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() payload: ReservationUpdatePayloadDto,
  ): Promise<ReservationGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    return await this.reservationService.update(id, payload);
  }

  @Get('/:id')
  async getReservationById(@Param('id') id: number): Promise<ReservationGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    const reservation = await this.reservationService.findById(id);
    if (!reservation) throw new NotFoundException();
    return reservation;
  }
}
