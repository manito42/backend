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
import { MenteeFeedbackService } from './menteeFeedback.service';
import { MenteeFeedbackResponseDto } from './dto/response/menteeFeedbackResponse.dto';
import { MenteeFeedbackCreatePayloadDto } from './dto/request/menteeFeedbackCreatePayload.dto';
import { GetMenteeFeedbacksQueryDto } from './dto/request/menteeFeedbackQuery.dto';

@Controller('/mentee_feedbacks')
export class MenteeFeedbackController {
  constructor(private readonly menteeFeedbackService: MenteeFeedbackService) {}

  @Get('/')
  async getMenteeFeedbacks(
    @Query() query: GetMenteeFeedbacksQueryDto,
  ): Promise<Array<MenteeFeedbackResponseDto>> {
    return await this.menteeFeedbackService.findMany(query);
  }

  @Post('/')
  async create(@Body() body: MenteeFeedbackCreatePayloadDto): Promise<MenteeFeedbackResponseDto> {
    return await this.menteeFeedbackService.create(body);
  }

  @Get('/:id')
  async getMenteeFeedbackById(@Param('id') id: number): Promise<MenteeFeedbackResponseDto> {
    if (id < 0) throw new BadRequestException();
    const feedback = await this.menteeFeedbackService.findById(id);
    if (!feedback) throw new NotFoundException();
    return feedback;
  }
}
