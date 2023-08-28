import { Reservation, User } from '@prisma/client';

export interface IReservationEventPayload {
  mentor: User;
  mentee: User;
  reservation: Reservation;
}
