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
import { MentorProfilePaginationResponseDto } from 'src/models/mentorProfile/dto/response/mentorProfilePaginationResponse.dto';

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
  ): Promise<MentorProfilePaginationResponseDto> {
    const totalCount = await this.prisma.mentorProfile.count({
      where: getMentorProfilesWhereQuery(isHide, hashtagId, categoryId),
    });
    const totalPage = Math.ceil(totalCount / take) - 1;

    return {
      content: await this.prisma.mentorProfile.findMany({
        take: take,
        skip: page * take,
        select: MentorProfileSelectQuery,
        where: getMentorProfilesWhereQuery(isHide, hashtagId, categoryId),
        orderBy: {
          updatedAt: 'desc',
        },
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
   * @param search_by_category_name
   * @param search
   */
  async findBySearch(
    take: number,
    page: number,
    search_by_hashtag_name: boolean,
    search_by_user_nickname: boolean,
    search_by_category_name: boolean,
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
        search_by_category_name,
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
        socialLink: data.socialLink,
      },
      select: MentorProfileSelectQuery,
    });
  }
}
