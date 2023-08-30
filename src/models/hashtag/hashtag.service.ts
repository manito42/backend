import { Injectable } from '@nestjs/common';
import { HashtagGetResponseDto } from './dto/response/hashtagGetResponse.dto';
import { HashtagRepository } from '../../database/repository/hashtag.repository';

@Injectable()
export class HashtagService {
  constructor(private readonly hashtagRepository: HashtagRepository) {}
  async findMany(
    take: number,
    page: number,
    profileId: number,
    reservationId: number,
    search: string,
  ): Promise<Array<HashtagGetResponseDto>> {
    return this.hashtagRepository.findMany(take, page, profileId, reservationId, search);
  }
  async findById(id: number): Promise<HashtagGetResponseDto> {
    return this.hashtagRepository.findById(id);
  }

  async findByName(name: string): Promise<HashtagGetResponseDto> {
    return this.hashtagRepository.findByName(name);
  }

  async create(name: string): Promise<HashtagGetResponseDto> {
    return this.hashtagRepository.create(name);
  }
}
