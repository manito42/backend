import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { MenteeFeedbackResponseDto } from './menteeFeedbackResponse.dto';

export class MenteeFeedbackPaginationResponseDto
  implements IPaginationResponse<MenteeFeedbackResponseDto>
{
  content: MenteeFeedbackResponseDto[];
  page: {
    take: number;
    page: number;
    totalPage: number;
    currentPage: number;
    isLast: boolean;
  };
}
