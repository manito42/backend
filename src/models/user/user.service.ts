import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { UserGetIncludes } from './queries/userGet.query';
import { User } from '@prisma/client';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers(take: number, page: number): Promise<Array<User>> {
    // we have to check fail conditions here
    return this.prisma.user.findMany({
      skip: take * page,
      take: take,
      include: UserGetIncludes,
    });
  }

  async getUserById(id: number): Promise<User> {
    // we have to check there are no user -> 404
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: UserGetIncludes,
    });
  }

  async createUser(payload: UserCreateDto): Promise<User> {
    // we have to check fail conditions here
    return this.prisma.user.create({
      data: payload,
      include: UserGetIncludes,
    });
  }

  async updateUser(id: number, payload: UserUpdateDto): Promise<User> {
    // we have to check fail conditions here
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: payload,
      include: UserGetIncludes,
    });
  }

  async verifyNickname(nickname: string): Promise<void> {
    // we have to check fail conditions here
    const user = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });
    if (!user) throw new ConflictException();
  }
}
