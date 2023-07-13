import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MentorFeedbackService } from './mentorFeedback.service';
import { MentorFeedbackResponseDto } from './dto/response/mentorFeedbackResponse.dto';
import { MentorFeedbackCreatePayloadDto } from './dto/request/mentorFeedbackCreatePayload.dto';
import { GetMentorFeedbacksQueryDto } from './dto/request/mentorFeedbackQuery.dto';

@Controller('/mentor_feedbacks')
export class MentorFeedbackController {
  constructor(private readonly mentorFeedbackService: MentorFeedbackService) {}

  @Get('/')
  async getMentorFeedbacks(
    @Query() query: GetMentorFeedbacksQueryDto,
  ): Promise<Array<MentorFeedbackResponseDto>> {
    return this.mentorFeedbackService.findMany(query);
  }

  @Post('/')
  async create(@Body() body: MentorFeedbackCreatePayloadDto): Promise<MentorFeedbackResponseDto> {
    return this.mentorFeedbackService.create(body);
  }

  @Get('/:id')
  async getMentorFeedbackById(@Param('id') id: number): Promise<MentorFeedbackResponseDto> {
    if (id < 0) throw new BadRequestException();
    const feedback = await this.mentorFeedbackService.findById(id);
    if (!feedback) throw new NotFoundException();
    return feedback;
  }
}
