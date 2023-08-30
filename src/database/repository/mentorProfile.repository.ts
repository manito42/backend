import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { MentorProfileGetResponseDto } from '../../models/mentorProfile/dto/response/mentorProfileGetResponse.dto';
import { MentorProfileSelectQuery } from '../../models/mentorProfile/queries/mentorProfileSelect.query';
import {
  getMentorProfilesSearchWhereQuery,
  getMentorProfilesWhereQuery,
} from '../../models/mentorProfile/queries/getMentorProfilesWhereQuery';
import { MentorProfileUpdatePayloadDto } from '../../models/mentorProfile/dto/request/mentorProfileUpdatePayload.dto';
import { SelectAllType } from '../../common/constants/selectAll.type';

@Injectable()
export class MentorProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * find mentor profiles
   * @param take
   * @param page
   * @param isHide
   * @param hashtagId
   * @param categoryId
   * @param sort
   */
  async findMany(
    take: number,
    page: number,
    isHide: boolean | SelectAllType,
    hashtagId: number | SelectAllType,
    categoryId: number | SelectAllType,
    sort?,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    return this.prisma.mentorProfile.findMany({
      take: take,
      skip: page * take,
      select: MentorProfileSelectQuery,
      where: getMentorProfilesWhereQuery(isHide, hashtagId, categoryId),
      orderBy: sort,
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

  /**
   * find mentor profiles by search
   * @param take
   * @param page
   * @param search_by_hashtag_name
   * @param search_by_user_nickname
   * @param search
   */
  async findBySearch(
    take: number,
    page: number,
    search_by_hashtag_name: boolean,
    search_by_user_nickname: boolean,
    search?: string,
  ): Promise<Array<MentorProfileGetResponseDto>> {
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

  async update(userId: number, data: MentorProfileUpdatePayloadDto) {
    return this.prisma.mentorProfile.update({
      where: {
        userId: userId,
      },
      data: {
        shortDescription: data.shortDescription,
        description: data.description,
        hashtags: {
          set: data.hashtags,
        },
        categories: {
          set: data.categories,
        },
        isHide: data.isHide,
      },
      select: MentorProfileSelectQuery,
    });
  }
}
