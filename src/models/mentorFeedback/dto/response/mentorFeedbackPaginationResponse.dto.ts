import { MentorFeedbackResponseDto } from './mentorFeedbackResponse.dto';
import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';

export class MentorFeedbackPaginationResponseDto
  implements IPaginationResponse<MentorFeedbackResponseDto>
{
  content: MentorFeedbackResponseDto[];
  page: {
    take: number;
    page: number;
    totalPage: number;
    currentPage: number;
    isLast: boolean;
  };
}
