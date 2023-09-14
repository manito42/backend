import { IReservationResponse } from '../../../../common/interfaces/api/reservation/reservationResponse.interface';
import { IMentorFeedbackResponse } from '../../../../common/interfaces/api/mentorFeedback/mentorFeedbackResponse.interface';
import { IMenteeFeedbackResponse } from '../../../../common/interfaces/api/menteeFeedback/menteeFeedbackResponse.interface';
import { ICategoryResponse } from '../../../../common/interfaces/api/category/categoryResponse.interface';
import { IHashtagResponse } from '../../../../common/interfaces/api/hashtag/hashtagResponse.interface';

export class ReservationGetResponseDto implements IReservationResponse {
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
