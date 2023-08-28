import { IMentorFeedbackResponse } from '../../../../common/interfaces/api/mentorFeedback/mentorFeedbackResponse.interface';

export class MentorFeedbackResponseDto implements IMentorFeedbackResponse {
  id: number;
  mentorId: number;
  menteeId: number;
  reservationId: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
