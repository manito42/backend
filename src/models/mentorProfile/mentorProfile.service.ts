import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MentorProfileGetResponseDto } from './dto/response/mentorProfileGetResponse.dto';
import { MentorProfileUpdatePayloadDto } from './dto/request/mentorProfileUpdatePayload.dto';
import { MentorProfileRepository } from '../../database/repository/mentorProfile.repository';
import { SelectAllType } from '../../common/constants/selectAll.type';
import { MentorProfilePaginationResponseDto } from './dto/response/mentorProfilePaginationResponse.dto';

@Injectable()
export class MentorProfileService {
  constructor(private readonly mentorProfileRepository: MentorProfileRepository) {}

  async findMany(
    take: number,
    page: number,
    isHide: boolean | SelectAllType,
    hashtagId: number | SelectAllType,
    categoryId: number | SelectAllType,
    sort?,
  ): Promise<MentorProfilePaginationResponseDto> {
    return await this.mentorProfileRepository.findMany(take, page, isHide, hashtagId, categoryId);
  }

  async findById(id: number): Promise<MentorProfileGetResponseDto> {
    return this.mentorProfileRepository.findById(id);
  }

  async findBySearch(
    take: number,
    page: number,
    search_by_hashtag_name: boolean,
    search_by_user_nickname: boolean,
    search_by_category_name: boolean,
    search?: string,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    return this.mentorProfileRepository.findBySearch(
      take,
      page,
      search_by_hashtag_name,
      search_by_user_nickname,
      search_by_category_name,
      search,
    );
  }

  async update(userId: number, data: MentorProfileUpdatePayloadDto) {
    /**
     * validate data with isHide
     * isHide가 true일 경우, 카테고리 혹은 해시태그만 변경하는 경우 validation.
     * */
    if (data.isHide === true) {
      const profile = await this.mentorProfileRepository.findById(userId);
      if (!profile) throw new NotFoundException("mentor profile doesn't exist");

      // 현재 프로필에 카테고리가 없고, 업데이트할 카테고리가 property에 없는 경우
      if (profile.categories.length === 0 && !data.categories)
        throw new BadRequestException('categories can not be empty');

      // 현재 프로필에 해시태그가 없고, 업데이트할 해시태그가 property에 없는 경우
      if (profile.hashtags.length === 0 && !data.hashtags)
        throw new BadRequestException('hashtags can not be empty');

      // 현재 프로필에 소셜링크가 없고, 업데이트할 소셜링크가 property에 없는 경우
      if (profile.socialLink.length === 0 && !data.socialLink)
        throw new BadRequestException('socialLink can not be empty');
    }

    return this.mentorProfileRepository.update(userId, data);
  }
}
