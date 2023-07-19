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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MentorProfileService } from './mentorProfile.service';
import { MentorProfileGetResponseDto } from './dto/response/mentorProfileGetResponse.dto';
import { MentorProfileCreatePayloadDto } from './dto/request/mentorProfileCreatePayload.dto';
import { MentorProfileUpdatePayloadDto } from './dto/request/mentorProfileUpdatePayload.dto';
import { GetMentorProfileQueryDto } from './dto/request/mentorProfileQuery.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { GetUserRole } from '../../common/decorators/getUserRole.decorator';
import { UserRole } from '@prisma/client';
import { GetUserId } from '../../common/decorators/getUserId.decorator';

@Controller('/mentor_profiles')
export class MentorProfileController {
  constructor(private readonly mentorProfileService: MentorProfileService) {}

  /**
   * @access ALL
   */
  @Get('/')
  async getMentorProfiles(
    @Query() query: GetMentorProfileQueryDto,
  ): Promise<Array<MentorProfileGetResponseDto>> {
    return await this.mentorProfileService.findMany(query);
  }

  /**
   * @access >= OWNER
   */
  @Post('/')
  @UseGuards(JwtGuard)
  async create(
    @GetUserRole() role: UserRole,
    @GetUserId() userId: number,
    @Body() payload: MentorProfileCreatePayloadDto,
  ): Promise<MentorProfileGetResponseDto> {
    if (role !== UserRole.ADMIN && userId !== payload.userId) throw new UnauthorizedException();
    return await this.mentorProfileService.create(payload);
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
    @GetUserId() userId: number,
    @Param('id') id: number,
    @Body() payload: MentorProfileUpdatePayloadDto,
  ): Promise<MentorProfileGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    const profile = await this.mentorProfileService.update(id, userId, payload);
    if (role !== UserRole.ADMIN && !profile) throw new UnauthorizedException();
    if (!profile) throw new NotFoundException();
    return profile;
  }
}
