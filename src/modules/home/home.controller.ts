import { Controller, Get, Param, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { GetHomeQueryDto } from './dto/request/homeQuery.dto';
import { MentorProfileService } from '../../models/mentorProfile/mentorProfile.service';
import { MentorProfileGetResponseDto } from '../../models/mentorProfile/dto/response/mentorProfileGetResponse.dto';
import { GetHomeCategoryParameterDto } from './dto/request/homeParameter.dto';
import { SelectAllType } from '../../common/constants/selectAll.type';

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
    const { take, page } = query;
    const sortQuery = this.homeService.getHomeProfileSortQuery();
    const isHide = false;
    const hashtagId = SelectAllType.ALL;
    const categoryId = SelectAllType.ALL;
    const profiles = await this.mentorProfileService.findMany(
      take,
      page,
      isHide,
      hashtagId,
      categoryId,
      sortQuery,
    );
    return this.homeService.random(profiles);
  }

  @Get('/:category_id')
  async getHomeProfilesByCategory(
    @Query() query: GetHomeQueryDto,
    @Param() param: GetHomeCategoryParameterDto,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    const { take, page } = query;
    const { category_id } = param;
    const sortQuery = this.homeService.getHomeProfileSortQuery();
    const isHide = false;
    const hashtagId = SelectAllType.ALL;
    const profiles = await this.mentorProfileService.findMany(
      take,
      page,
      isHide,
      hashtagId,
      category_id,
      sortQuery,
    );
    return this.homeService.random(profiles);
  }
}
