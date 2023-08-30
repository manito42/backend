import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagGetResponseDto } from './dto/response/hashtagGetResponse.dto';
import { HashtagCreatePayloadDto } from './dto/request/hashtagCreatePayload.dto';
import { GetHashtagsQueryDto } from './dto/request/hashtagQuery.dto';
import { Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';

@Controller('/hashtags')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get('/')
  async getHashtags(@Query() query: GetHashtagsQueryDto): Promise<Array<HashtagGetResponseDto>> {
    const { page, take, profile_id, reservation_id, search } = query;
    return await this.hashtagService.findMany(take, page, profile_id, reservation_id, search);
  }

  @Get('/:id')
  async getHashtagById(@Param('id') id: number): Promise<HashtagGetResponseDto> {
    if (id < 0) throw new BadRequestException();
    const hashtag = await this.hashtagService.findById(id);
    if (!hashtag) throw new NotFoundException();
    return hashtag;
  }

  /**
   * @note: 일반적인 상황에서는 이미 생성된 객체에 대해서 409 를 반환하는 것이 맞겠으나, 협의 이후 이미 존재할 경우 200을 response 하도록했습니다.
   */
  @Post('/')
  @UseGuards(JwtGuard)
  async create(
    @Body() payload: HashtagCreatePayloadDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HashtagGetResponseDto> {
    const name = payload.name;
    const existHashtag = await this.hashtagService.findByName(name);
    if (existHashtag) {
      res.status(HttpStatus.OK);
      return existHashtag;
    }
    return await this.hashtagService.create(name);
  }
}
