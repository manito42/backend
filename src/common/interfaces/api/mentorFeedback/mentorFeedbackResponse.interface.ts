export interface IMentorFeedbackResponse {
  id: number;
  mentorId: number;
  menteeId: number;
  reservationId: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
