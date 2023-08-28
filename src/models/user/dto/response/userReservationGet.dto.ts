import { IReservationResponse } from '../../../../common/interfaces/api/reservation/reservationResponse.interface';

export class UserReservationGetDto {
  menteeReservations: IReservationResponse[];
  mentorReservations: IReservationResponse[];
}
