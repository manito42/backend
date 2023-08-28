import { IMentorFeedbackCreateRequest } from '../../../../common/interfaces/api/mentorFeedback/mentorFeedbackRequest.interface';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
export class MentorFeedbackCreatePayloadDto implements IMentorFeedbackCreateRequest {
  @IsNumber()
  @Min(1)
  mentorId: number;
  @IsNumber()
  @Min(1)
  menteeId: number;
  @IsNumber()
  @Min(1)
  reservationId: number;
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
