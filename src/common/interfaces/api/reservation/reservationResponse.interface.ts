import { IMentorFeedbackResponse } from '../mentorFeedback/mentorFeedbackResponse.interface';
import { IMenteeFeedbackResponse } from '../menteeFeedback/menteeFeedbackResponse.interface';

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
  mentorFeedback: IMentorFeedbackResponse;
  menteeFeedback: IMenteeFeedbackResponse;
  createdAt: Date;
  updatedAt: Date;
}
