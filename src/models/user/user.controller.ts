import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserCreatePayloadDto } from './dto/request/userCreatePayload.dto';
import { UserUpdatePayloadDto } from './dto/request/userUpdatePayload.dto';
import { UserGetResponseDto } from './dto/response/userGetResponse.dto';
import { GetUserQueryDto } from './dto/request/userQuery.dto';
import { UserReservationGetDto } from './dto/response/userReservationGet.dto';
import { GetUserReservationQueryDto } from './dto/request/userReservationQuery.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUsers(@Query() query: GetUserQueryDto): Promise<Array<UserGetResponseDto>> {
    return await this.userService.findMany(query);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<UserGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post('/')
  async create(@Body() payload: UserCreatePayloadDto): Promise<UserGetResponseDto> {
    return await this.userService.create(payload);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() payload: UserUpdatePayloadDto,
  ): Promise<UserGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    return await this.userService.update(id, payload);
  }

  @Get('/verify_nickname/:nickname')
  async verifyNickname(@Param('nickname') nickname: string): Promise<void> {
    const user = await this.userService.findByNickname(nickname);
    if (user) throw new ConflictException();
  }

  @Get('/:id/reservations')
  async getUserReservations(
    @Param('id') id: number,
    @Query() query: GetUserReservationQueryDto,
  ): Promise<UserReservationGetDto> {
    if (id < 0) throw new BadRequestException();
    const reservations = await this.userService.findUserReservation(id, query);
    if (!reservations) throw new BadRequestException();
    return reservations;
  }
}
