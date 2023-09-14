import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { HashtagGetResponseDto } from '../../models/hashtag/dto/response/hashtagGetResponse.dto';
import { getHashtagsWhereQuery } from '../../models/hashtag/queries/getHashtagsWhereQuery';
import { HashtagGetSelectQuery } from '../../models/hashtag/queries/hashtagGetSelect.query';
import { HashtagPaginationResponseDto } from 'src/models/hashtag/dto/response/hashtagPaginationResponse.dto';

@Injectable()
export class HashtagRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(
    take: number,
    page: number,
    profileId: number,
    reservationId: number,
    search: string,
  ): Promise<HashtagPaginationResponseDto> {
    const totalCount = await this.prisma.hashtag.count({
      where: getHashtagsWhereQuery(profileId, reservationId, search),
    });
    const totalPage = Math.ceil(totalCount / take) - 1;
    return {
      content: await this.prisma.hashtag.findMany({
        take: take,
        skip: page * take,
        where: getHashtagsWhereQuery(profileId, reservationId, search),
      }),
      page: {
        take: take,
        page: page,
        totalPage: totalPage,
        currentPage: page,
        isLast: totalPage <= page,
      },
    };
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
