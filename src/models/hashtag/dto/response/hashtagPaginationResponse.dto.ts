import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { PaginationInfoDto } from 'src/common/interfaces/api/common/PaginationInfoDto.interface';
import { HashtagGetResponseDto } from './hashtagGetResponse.dto';

export class HashtagPaginationResponseDto implements IPaginationResponse<HashtagGetResponseDto> {
  content: HashtagGetResponseDto[];
  page: PaginationInfoDto;
}
