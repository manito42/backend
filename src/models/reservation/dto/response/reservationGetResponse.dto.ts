import { IReservationResponse } from '../../../../common/interfaces/api/reservation/reservationResponse.interface';
import { IMentorFeedbackResponse } from '../../../../common/interfaces/api/mentorFeedback/mentorFeedbackResponse.interface';
import { IMenteeFeedbackResponse } from '../../../../common/interfaces/api/menteeFeedback/menteeFeedbackResponse.interface';

export class ReservationGetResponseDto implements IReservationResponse {
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
  mentorFeedback: IMentorFeedbackResponse;
  menteeFeedback: IMenteeFeedbackResponse;
  createdAt: Date;
  updatedAt: Date;
}
