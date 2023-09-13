import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { PaginationInfoDto } from 'src/common/interfaces/api/common/PaginationInfoDto.interface';
import { MenteeFeedbackResponseDto } from './menteeFeedbackResponse.dto';

export class MenteeFeedbackPaginationResponseDto
  implements IPaginationResponse<MenteeFeedbackResponseDto>
{
  content: MenteeFeedbackResponseDto[];
  page: PaginationInfoDto;
}
