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
    return await this.mentorProfileService.findBySearch(query, param.search);
  }
}
