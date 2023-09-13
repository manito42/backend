import { MentorProfileGetResponseDto } from './mentorProfileGetResponse.dto';
import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { PaginationInfoDto } from 'src/common/interfaces/api/common/PaginationInfoDto.interface';

export class MentorProfilePaginationResponseDto
  implements IPaginationResponse<MentorProfileGetResponseDto>
{
  content: MentorProfileGetResponseDto[];
  page: PaginationInfoDto;
}
