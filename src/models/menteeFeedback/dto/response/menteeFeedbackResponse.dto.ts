import { IMenteeFeedbackResponse } from '../../../../common/interfaces/api/menteeFeedback/menteeFeedbackResponse.interface';

export class MenteeFeedbackResponseDto implements IMenteeFeedbackResponse {
  id: number;
  mentorId: number;
  menteeId: number;
  reservationId: number;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
