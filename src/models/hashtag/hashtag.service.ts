import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { HashtagGetResponseDto } from './dto/response/hashtagGetResponse.dto';
import { HashtagCreatePayloadDto } from './dto/request/hashtagCreatePayload.dto';
import { HashtagGetSelectQuery } from './queries/hashtagGetSelect.query';
import { GetHashtagsQueryDto } from './dto/request/hashtagQuery.dto';
import { getHashtagsWhereQuery } from './queries/getHashtagsWhereQuery';

@Injectable()
export class HashtagService {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(query: GetHashtagsQueryDto): Promise<Array<HashtagGetResponseDto>> {
    const { profile_id, reservation_id, take, page, search } = query;
    return this.prisma.hashtag.findMany({
      take: take,
      skip: page * take,
      where: getHashtagsWhereQuery(profile_id, reservation_id, search),
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

  async create(payload: HashtagCreatePayloadDto): Promise<HashtagGetResponseDto> {
    return this.prisma.hashtag.create({
      data: { name: payload.name },
    });
  }
}
