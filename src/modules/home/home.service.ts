import { Injectable } from '@nestjs/common';
import { MentorProfileGetResponseDto } from '../../models/mentorProfile/dto/response/mentorProfileGetResponse.dto';

/**
 * @brief HomeService
 * @deprecated
 */
@Injectable()
export class HomeService {
  constructor() {}

  random(profiles: MentorProfileGetResponseDto[]) {
    return profiles.sort(() => Math.random() - 0.5);
  }
}
