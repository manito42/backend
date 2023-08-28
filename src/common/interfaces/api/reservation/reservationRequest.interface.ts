import { ReservationStatus } from '@prisma/client';

export interface IReservationCreateRequest {
  mentorId: number;
  menteeId: number;
  categoryId: number;
  requestMessage?: string;
  status?: ReservationStatus;
  hashtags?: Array<{ id: number }>;
}

export interface IReservationUpdateRequest {
  requestMessage?: string;
  hashtags?: { id: number }[];
  categoryId?: number;
  status?: ReservationStatus;
}
