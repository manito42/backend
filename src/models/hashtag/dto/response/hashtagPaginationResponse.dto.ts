import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { HashtagGetResponseDto } from './hashtagGetResponse.dto';

export class HashtagPaginationResponseDto implements IPaginationResponse<HashtagGetResponseDto> {
  content: HashtagGetResponseDto[];
  page: {
    take: number;
    page: number;
    totalPage: number;
    currentPage: number;
    isLast: boolean;
  };
}
