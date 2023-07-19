import { Injectable } from '@nestjs/common';
import { MentorProfileGetResponseDto } from '../../models/mentorProfile/dto/response/mentorProfileGetResponse.dto';

@Injectable()
export class HomeService {
  constructor() {}

  random(profiles: MentorProfileGetResponseDto[]) {
    return profiles.sort(() => Math.random() - 0.5);
  }

  getRecentUpdatedMentorSortQuery() {
    return {
      updatedAt: 'desc',
    };
  }

  getHomeProfileSortQuery() {
    return this.getRecentUpdatedMentorSortQuery();
  }
}
