import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MentorProfileService } from './mentorProfile.service';
import { MentorProfileGetResponseDto } from './dto/response/mentorProfileGetResponse.dto';
import { MentorProfileUpdatePayloadDto } from './dto/request/mentorProfileUpdatePayload.dto';
import { GetMentorProfileQueryDto } from './dto/request/mentorProfileQuery.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { GetUserRole } from '../../common/decorators/getUserRole.decorator';
import { UserRole } from '@prisma/client';
import { GetUserId } from '../../common/decorators/getUserId.decorator';
import { MentorProfilePaginationResponseDto } from './dto/response/mentorProfilePaginationResponse.dto';

@Controller('/mentor_profiles')
export class MentorProfileController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  /**
   * @access ADMIN
   */
  @Get('/')
  @UseGuards(JwtGuard)
  async getMentorProfiles(
    @GetUserRole() role: UserRole,
    @Query() query: GetMentorProfileQueryDto,
  ): Promise<MentorProfilePaginationResponseDto> {
    if (role !== UserRole.ADMIN) throw new UnauthorizedException();
    const { take, page, is_hide, hashtag_id, category_id } = query;
    return await this.mentorProfileService.findMany(take, page, is_hide, hashtag_id, category_id);
  }

  /**
   * @access ALL
   */
  @Get('/:id')
  async getMentorProfileById(@Param('id') id: number): Promise<MentorProfileGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    const profile = await this.mentorProfileService.findById(id);
    if (!profile) throw new NotFoundException();
    return profile;
  }

  /**
   * @access >= OWNER
   */
  @Patch('/:id')
  @UseGuards(JwtGuard)
  async update(
    @GetUserRole() role: UserRole,
    @GetUserId() tokenUserId: number,
    @Param('id') id: number,
    @Body() data: MentorProfileUpdatePayloadDto,
  ): Promise<MentorProfileGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    if (role !== UserRole.ADMIN && tokenUserId !== id) throw new UnauthorizedException();

    if (data.description === null || data.shortDescription === null)
      throw new BadRequestException('Description과 ShortDescription은 null이 될 수 없습니다');

    if (data.isHide === true) {
      if (!data.socialLink || data.socialLink == null)
        throw new BadRequestException('멘토 프로필 활성화를 위해선 소셜 링크를 입력해야 합니다');
      if (data.hashtags?.length === 0 || data.categories?.length === 0)
        throw new BadRequestException(
          '멘토 프로필 활성화를 위해선 해시태그와 카테고리를 최소 1개 이상 입력해야 합니다',
        );
    }

    const updatedProfile = await this.mentorProfileService.update(id, data);

    if (!updatedProfile) throw new NotFoundException();

    return updatedProfile;
  }
}
