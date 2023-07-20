import { Controller, Get, Param, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { GetHomeQueryDto } from './dto/request/homeQuery.dto';
import { MentorProfileService } from '../../models/mentorProfile/mentorProfile.service';
import { MentorProfileGetResponseDto } from '../../models/mentorProfile/dto/response/mentorProfileGetResponse.dto';
import { GetHomeCategoryParameterDto } from './dto/request/homeParameter.dto';
import { GetMentorProfileQueryDto } from '../../models/mentorProfile/dto/request/mentorProfileQuery.dto';

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly mentorProfileService: MentorProfileService,
  ) {}

  @Get('/')
  async getHomeProfiles(
    @Query() query: GetHomeQueryDto,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    const sortQuery = this.homeService.getHomeProfileSortQuery();
    const profiles = await this.mentorProfileService.findMany(query, sortQuery);
    return this.homeService.random(profiles);
  }

  @Get('/:category_id')
  async getHomeProfilesByCategory(
    @Query() query: GetHomeQueryDto,
    @Param() param: GetHomeCategoryParameterDto,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    const profileQuery: GetMentorProfileQueryDto = {
      category_id: param.category_id,
      ...query,
    };
    const sortQuery = this.homeService.getHomeProfileSortQuery();
    const profiles = await this.mentorProfileService.findManyWithoutHide(profileQuery, sortQuery);
    return this.homeService.random(profiles);
  }
}
