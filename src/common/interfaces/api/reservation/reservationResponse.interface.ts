import { IMentorFeedbackResponse } from '../mentorFeedback/mentorFeedbackResponse.interface';
import { IMenteeFeedbackResponse } from '../menteeFeedback/menteeFeedbackResponse.interface';
import { ICategoryResponse } from '../category/categoryResponse.interface';
import { IHashtagResponse } from '../hashtag/hashtagResponse.interface';

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
  createdAt: Date;
  updatedAt: Date;
}
