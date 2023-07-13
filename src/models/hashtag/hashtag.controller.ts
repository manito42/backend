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
import { HashtagService } from './hashtag.service';
import { HashtagGetResponseDto } from './dto/response/hashtagGetResponse.dto';
import { HashtagCreatePayloadDto } from './dto/request/hashtagCreatePayload.dto';
import { GetHashtagsQueryDto } from './dto/request/hashtagQuery.dto';

@Controller('/hashtags')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get('/')
  async getHashtags(@Query() query: GetHashtagsQueryDto): Promise<Array<HashtagGetResponseDto>> {
    return await this.hashtagService.findMany(query);
  }

  @Get('/:id')
  async getHashtagById(@Param('id') id: number): Promise<HashtagGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    const hashtag = await this.hashtagService.findById(id);
    if (!hashtag) throw new NotFoundException();
    return hashtag;
  }

  @Post('/')
  async create(@Body() payload: HashtagCreatePayloadDto): Promise<HashtagGetResponseDto> {
    return await this.hashtagService.create(payload);
  }
}
