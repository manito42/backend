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
import { MenteeFeedbackService } from './menteeFeedback.service';
import { MenteeFeedbackResponseDto } from './dto/response/menteeFeedbackResponse.dto';
import { MenteeFeedbackCreatePayloadDto } from './dto/request/menteeFeedbackCreatePayload.dto';
import { GetMenteeFeedbacksQueryDto } from './dto/request/menteeFeedbackQuery.dto';
import { GetUserRole } from '../../common/decorators/getUserRole.decorator';
import { UserRole } from '@prisma/client';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';

@Controller('/mentee_feedbacks')
export class MenteeFeedbackController {
  constructor(private readonly menteeFeedbackService: MenteeFeedbackService) {}

  @Get('/')
  @UseGuards(JwtGuard)
  async getMenteeFeedbacks(
    @GetUserRole() role: UserRole,
    @Query() query: GetMenteeFeedbacksQueryDto,
  ): Promise<Array<MenteeFeedbackResponseDto>> {
    if (role !== UserRole.ADMIN) throw new UnauthorizedException();
    return await this.menteeFeedbackService.findMany(query);
  }

  @Post('/')
  @UseGuards(JwtGuard)
  async create(
    @GetUserRole() role: UserRole,
    @Body() body: MenteeFeedbackCreatePayloadDto,
  ): Promise<MenteeFeedbackResponseDto> {
    if (role !== UserRole.ADMIN) throw new UnauthorizedException();
    return await this.menteeFeedbackService.create(body);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getMenteeFeedbackById(@Param('id') id: number): Promise<MenteeFeedbackResponseDto> {
    if (id < 0) throw new BadRequestException();
    const feedback = await this.menteeFeedbackService.findById(id);
    if (!feedback) throw new NotFoundException();
    return feedback;
  }
}
