export interface IMenteeFeedbackCreateRequest {
  mentorId: number;
  menteeId: number;
  reservationId: number;
  rating: number;
  content?: string;
}
