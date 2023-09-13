import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { PaginationInfoDto } from 'src/common/interfaces/api/common/PaginationInfoDto.interface';
import { ReservationGetResponseDto } from './reservationGetResponse.dto';

export class ReservationPaginationResponseDto
  implements IPaginationResponse<ReservationGetResponseDto>
{
  content: ReservationGetResponseDto[];
  page: PaginationInfoDto;
}
