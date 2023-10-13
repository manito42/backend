import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { Prisma } from '@prisma/client';

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

  /**
   * @brief 멘토 프로필 업데이트
   *
   * @param number
   * @param MentorProfileUpdatePayloadDto
   *
   * @description 멘토 프로필을 업데이트하는 함수입니다.
   * - 멘토프로필업데이트시, 카테고리, 해시태그, 소셜링크가 없으면 isHide를 true로 업데이트합니다.
   */
  async update(userId: number, data: MentorProfileUpdatePayloadDto) {
    //validation for hashtags, categories, socialLink. 필수항목 사라지면 isHide를 true로.
    return this.prisma.$transaction(async (prisma) => {
      const profile = await prisma.mentorProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          hashtags: true,
          categories: true,
          socialLink: true,
          isHide: true,
        },
      });

      if (!profile) throw new NotFoundException('업데이트할 프로필이 없습니다.');

      // 기존 프로필의 isHide 가져옴.
      let isHide = profile.isHide;
      //  업데이트할 카테고리가 0개인 경우
      if (data.categories.length == 0) isHide = true;
      // 업데이트할 해시태그가 0개인 경우
      if (data.hashtags.length == 0) isHide = true;
      if (data.socialLink == null) data.socialLink = '';

      return prisma.mentorProfile.update({
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
          isHide: isHide,
          socialLink: data.socialLink,
        },
        select: MentorProfileSelectQuery,
      });
    });
  }

  /**
   * @brief 멘토 프로필 활성화(isHide = false)
   *
   * @param userId
   * @detail 멘토 프로필을 활성화 시키는 함수입니다.
   * - 멘토 프로필 활성화위해선 카테고리가 최소 1개 이상 존재해야합니다.
   * - 멘토 프로필 활성화위해선 해시태그가 최소 1개 이상 존재해야합니다.
   */
  async activateMentorProfile(userId: number) {
    return this.prisma.$transaction(async (prisma) => {
      const profile = await prisma.mentorProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          hashtags: true,
          categories: true,
        },
      });

      if (!profile) throw new NotFoundException('업데이트할 프로필이 없습니다.');

      // 현재 프로필에 카테고리가 없는 경우
      if (profile.categories.length === 0)
        throw new BadRequestException('카테고리는 최소 1개 이상 선택해주세요.');

      // 현재 프로필에 해시태그가 없는경우
      if (profile.hashtags.length === 0)
        throw new BadRequestException('해시태그는 최소 1개 이상 선택해주세요.');

      return prisma.mentorProfile.update({
        where: {
          userId: userId,
        },
        data: {
          isHide: false,
        },
        select: MentorProfileSelectQuery,
      });
    });
  }

  /**
   * @brief 멘토 프로필 비활성화(isHide = true)
   *
   * @param number
   * @description 멘토 프로필을 비활성화 시키는 함수입니다.
   * - 멘토 프로필 비활성화시키면, 멘토 프로필이 검색되지 않습니다.
   */
  async deActivateMentorProfile(userId: number) {
    return this.prisma.mentorProfile.update({
      where: {
        userId: userId,
      },
      data: {
        isHide: true,
      },
      select: MentorProfileSelectQuery,
    });
  }
}
