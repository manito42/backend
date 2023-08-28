export interface IMenteeFeedbackResponse {
  id: number;
  mentorId: number;
  menteeId: number;
  reservationId: number;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
