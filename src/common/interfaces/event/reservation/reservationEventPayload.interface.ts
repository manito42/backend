import { ReservationGetResponseDto } from 'src/models/reservation/dto/response/reservationGetResponse.dto';
import { UserGetResponseDto } from 'src/models/user/dto/response/userGetResponse.dto';

export interface IReservationEventPayload {
  mentor: UserGetResponseDto;
  mentee: UserGetResponseDto;
  reservation: ReservationGetResponseDto;
}
