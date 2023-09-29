import { IMentorFeedbackResponse } from '../mentorFeedback/mentorFeedbackResponse.interface';
import { IMenteeFeedbackResponse } from '../menteeFeedback/menteeFeedbackResponse.interface';
import { ICategoryResponse } from '../category/categoryResponse.interface';
import { IHashtagResponse } from '../hashtag/hashtagResponse.interface';
import { ICancelReasonResponse } from '../cancelReason/cancelReasonResponse.interface';

export interface IReservationResponse {
  id: number;
  mentorId: number;
  menteeId: number;
  category: ICategoryResponse;
  requestMessage: string;
  status: string;
  hashtags: IHashtagResponse[];
  mentorFeedback: IMentorFeedbackResponse;
  menteeFeedback: IMenteeFeedbackResponse;
  cancelReason: ICancelReasonResponse;
  createdAt: Date;
  updatedAt: Date;
}
