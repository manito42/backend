import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { HashtagGetResponseDto } from '../../models/hashtag/dto/response/hashtagGetResponse.dto';
import { getHashtagsWhereQuery } from '../../models/hashtag/queries/getHashtagsWhereQuery';
import { HashtagGetSelectQuery } from '../../models/hashtag/queries/hashtagGetSelect.query';

@Injectable()
export class HashtagRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(
    take: number,
    page: number,
    profileId: number,
    reservationId: number,
    search: string,
  ): Promise<Array<HashtagGetResponseDto>> {
    return this.prisma.hashtag.findMany({
      take: take,
      skip: page * take,
      where: getHashtagsWhereQuery(profileId, reservationId, search),
    });
  }
  async findById(id: number): Promise<HashtagGetResponseDto> {
    return this.prisma.hashtag.findUnique({
      where: { id: id },
      select: HashtagGetSelectQuery,
    });
  }

  async findByName(name: string): Promise<HashtagGetResponseDto> {
    return this.prisma.hashtag.findUnique({ where: { name: name } });
  }

  async create(name: string): Promise<HashtagGetResponseDto> {
    return this.prisma.hashtag.create({
      data: { name: name },
    });
  }
}
