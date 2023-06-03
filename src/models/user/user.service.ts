import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { UserSelectQuery } from './queries/userSelect.query';
import { UserCreatePayloadDto } from './dto/request/userCreatePayload.dto';
import { UserUpdatePayloadDto } from './dto/request/userUpdatePayload.dto';
import { UserGetResponseDto } from './dto/response/userGetResponse.dto';
import { GetUserQueryDto } from './dto/request/userQuery.dto';

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
    return this.prisma.user.create({
      data: payload,
      select: UserSelectQuery,
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
}
