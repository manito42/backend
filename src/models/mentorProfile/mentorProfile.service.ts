import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';
import { MentorProfileSelectQuery } from './queries/mentorProfileSelect.query';
import { MentorProfileGetResponseDto } from './dto/response/mentorProfileGetResponse.dto';
import { MentorProfileCreatePayloadDto } from './dto/request/mentorProfileCreatePayload.dto';
import { MentorProfileUpdatePayloadDto } from './dto/request/mentorProfileUpdatePayload.dto';
import { GetMentorProfileQueryDto } from './dto/request/mentorProfileQuery.dto';
import {
  getMentorProfileRevealsWhereQuery,
  getMentorProfilesSearchWhereQuery,
  getMentorProfilesWhereQuery,
} from './queries/getMentorProfilesWhereQuery';
import { GetSearchQueryDto } from '../../modules/search/dto/request/searchQuery.dto';

@Injectable()
export class MentorProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    query: GetMentorProfileQueryDto,
    sort?,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    const { page, take, hashtag_id, category_id } = query;
    return this.prisma.mentorProfile.findMany({
      take: take,
      skip: page * take,
      select: MentorProfileSelectQuery,
      where: getMentorProfilesWhereQuery(hashtag_id, category_id),
      orderBy: sort,
    });
  }

  async findManyWithoutHide(
    query: GetMentorProfileQueryDto,
    sort?,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    const { page, take, hashtag_id, category_id } = query;
    return this.prisma.mentorProfile.findMany({
      take: take,
      skip: page * take,
      select: MentorProfileSelectQuery,
      where: getMentorProfileRevealsWhereQuery(hashtag_id, category_id),
      orderBy: sort,
    });
  }

  async create(payload: MentorProfileCreatePayloadDto): Promise<MentorProfileGetResponseDto> {
    return await this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: payload.userId },
        data: { isMentor: true },
      });
      return prisma.mentorProfile.create({
        data: payload,
        select: MentorProfileSelectQuery,
      });
    });
  }

  async findById(id: number): Promise<MentorProfileGetResponseDto> {
    return this.prisma.mentorProfile.findUnique({
      where: {
        userId: id,
      },
      select: MentorProfileSelectQuery,
    });
  }

  async findBySearch(
    query: GetSearchQueryDto,
    search: string,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    const { page, take, search_by_hashtag_name, search_by_user_nickname } = query;
    if (!search_by_hashtag_name && !search_by_user_nickname) throw new BadRequestException();
    return this.prisma.mentorProfile.findMany({
      take: take,
      skip: page * take,
      select: MentorProfileSelectQuery,
      where: getMentorProfilesSearchWhereQuery(
        search_by_hashtag_name,
        search_by_user_nickname,
        search,
      ),
    });
  }

  async update(userId: number, payload: MentorProfileUpdatePayloadDto) {
    return this.prisma.mentorProfile.update({
      where: {
        userId: userId,
      },
      data: {
        shortDescription: payload.shortDescription,
        description: payload.description,
        hashtags: {
          set: payload.hashtags,
        },
        categories: {
          set: payload.categories,
        },
        isHide: payload.isHide,
      },
      select: MentorProfileSelectQuery,
    });
  }
}
