import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MentorProfileService } from './mentorProfile.service';
import { MentorProfileGetResponseDto } from './dto/response/mentorProfileGetResponse.dto';
import { MentorProfileCreatePayloadDto } from './dto/request/mentorProfileCreatePayload.dto';
import { MentorProfileUpdatePayloadDto } from './dto/request/mentorProfileUpdatePayload.dto';
import { GetMentorProfileQueryDto } from './dto/request/mentorProfileQuery.dto';

@Controller('/mentor_profiles')
export class MentorProfileController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  @Get('/')
  async getMentorProfiles(
    @Query() query: GetMentorProfileQueryDto,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    return await this.mentorProfileService.findMany(query);
  }

  @Post('/')
  async create(
    @Body() payload: MentorProfileCreatePayloadDto,
  ): Promise<MentorProfileGetResponseDto> {
    // it must be checked that the user matched token user or admin
    return await this.mentorProfileService.create(payload);
  }

  @Get('/:id')
  async getMentorProfileById(@Param('id') id: number): Promise<MentorProfileGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    const profile = await this.mentorProfileService.findById(id);
    if (!profile) throw new NotFoundException();
    return profile;
  }

  @Patch('/:id')
  async update(
    @Param('id') id: number,
    @Body() payload: MentorProfileUpdatePayloadDto,
  ): Promise<MentorProfileGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    // it must be checked that the user matched token user or admin
    return await this.mentorProfileService.update(id, payload);
  }
}
