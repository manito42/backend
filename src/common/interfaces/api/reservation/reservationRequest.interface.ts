import { Hashtag, ReservationStatus } from '@prisma/client';

export interface IReservationCreateRequest {
  mentorId: number;
  menteeId: number;
  categoryId: number;
  requestMessage?: string;
  status?: ReservationStatus;
  hashtags?: Array<Hashtag>;
}

export interface IReservationUpdateRequest {
  requestMessage?: string;
  hashtags?: { id: number }[];
  categoryId?: number;
  status?: ReservationStatus;
}
