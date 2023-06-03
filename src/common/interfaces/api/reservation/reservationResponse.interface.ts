export interface IReservationResponse {
  id: number;
  mentorId: number;
  menteeId: number;
  categoryId: number;
  requestMessage: string;
  status: string;
  hashtags: {
    id: number;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
