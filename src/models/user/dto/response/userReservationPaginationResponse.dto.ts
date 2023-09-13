import { IPaginationResponse } from 'src/common/interfaces/api/common/IPaginationResponse.interface';
import { PaginationInfoDto } from 'src/common/interfaces/api/common/PaginationInfoDto.interface';
import { IReservationResponse } from 'src/common/interfaces/api/reservation/reservationResponse.interface';

export class UserReservationPaginationResponseDto
  implements IPaginationResponse<IReservationResponse>
{
  content: IReservationResponse[];
  page: PaginationInfoDto;
}
