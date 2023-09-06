import { Injectable } from '@nestjs/common';
import { MentorProfileGetResponseDto } from './dto/response/mentorProfileGetResponse.dto';
import { MentorProfileUpdatePayloadDto } from './dto/request/mentorProfileUpdatePayload.dto';
import { MentorProfileRepository } from '../../database/repository/mentorProfile.repository';
import { SelectAllType } from '../../common/constants/selectAll.type';

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
  ): Promise<Array<MentorProfileGetResponseDto>> {
    return this.mentorProfileRepository.findMany(take, page, isHide, hashtagId, categoryId, sort);
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
    return this.mentorProfileRepository.update(userId, data);
  }
}
