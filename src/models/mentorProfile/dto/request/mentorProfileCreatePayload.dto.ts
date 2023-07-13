import { IsNumber } from 'class-validator';
import { IMentorProfileCreateRequest } from '../../../../common/interfaces/api/mentorProfile/mentorProfileRequest.interface';

export class MentorProfileCreatePayloadDto
  implements IMentorProfileCreateRequest
{
  @IsNumber({}, { message: 'userId는 숫자여야 합니다.' })
  userId: number;
}
