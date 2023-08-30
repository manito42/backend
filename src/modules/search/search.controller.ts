import { Controller, Get, Param, Query } from '@nestjs/common';
import { MentorProfileService } from '../../models/mentorProfile/mentorProfile.service';
import { GetSearchQueryDto } from './dto/request/searchQuery.dto';
import { GetSearchParameterDto } from './dto/request/searchParameter.dto';
import { MentorProfileGetResponseDto } from '../../models/mentorProfile/dto/response/mentorProfileGetResponse.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  @Get('/mentor/:search')
  async getMentorProfilesBySearch(
    @Query() query: GetSearchQueryDto,
    @Param() param: GetSearchParameterDto,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    const { take, page, search_by_hashtag_name, search_by_user_nickname } = query;
    const { search } = param;
    return await this.mentorProfileService.findBySearch(
      take,
      page,
      search_by_hashtag_name,
      search_by_user_nickname,
      search,
    );
  }
}
