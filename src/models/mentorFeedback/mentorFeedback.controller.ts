import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MentorFeedbackService } from './mentorFeedback.service';
import { MentorFeedbackResponseDto } from './dto/response/mentorFeedbackResponse.dto';
import { MentorFeedbackCreatePayloadDto } from './dto/request/mentorFeedbackCreatePayload.dto';
import { GetMentorFeedbacksQueryDto } from './dto/request/mentorFeedbackQuery.dto';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { GetUserRole } from '../../common/decorators/getUserRole.decorator';
import { UserRole } from '@prisma/client';

@Controller('/mentor_feedbacks')
export class MentorFeedbackController {
  constructor(private readonly mentorFeedbackService: MentorFeedbackService) {}

  /**
   * @access >= ADMIN
   */
  @Get('/')
  @UseGuards(JwtGuard)
  async getMentorFeedbacks(
    @GetUserRole() role: UserRole,
    @Query() query: GetMentorFeedbacksQueryDto,
  ): Promise<Array<MentorFeedbackResponseDto>> {
    if (role !== UserRole.ADMIN) throw new UnauthorizedException();
    return this.mentorFeedbackService.findMany(query);
  }

  /**
   * @access >= ADMIN
   */
  @Post('/')
  @UseGuards(JwtGuard)
  async create(
    @GetUserRole() role: UserRole,
    @Body() body: MentorFeedbackCreatePayloadDto,
  ): Promise<MentorFeedbackResponseDto> {
    if (role !== UserRole.ADMIN) throw new UnauthorizedException();
    return this.mentorFeedbackService.create(body);
  }

  /**
   * @access >= USER
   */
  @Get('/:id')
  @UseGuards(JwtGuard)
  async getMentorFeedbackById(@Param('id') id: number): Promise<MentorFeedbackResponseDto> {
    if (id < 0) throw new BadRequestException();
    const feedback = await this.mentorFeedbackService.findById(id);
    if (!feedback) throw new NotFoundException();
    return feedback;
  }
}
