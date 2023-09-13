import { MentorFeedbackResponseDto } from './mentorFeedbackResponse.dto';
import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { PaginationInfoDto } from 'src/common/interfaces/api/common/PaginationInfoDto.interface';

export class MentorFeedbackPaginationResponseDto
  implements IPaginationResponse<MentorFeedbackResponseDto>
{
  content: MentorFeedbackResponseDto[];
  page: PaginationInfoDto;
}
