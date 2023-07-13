import { IMenteeFeedbackCreateRequest } from '../../../../common/interfaces/api/menteeFeedback/menteeFeedbackRequest.interface';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
export class MenteeFeedbackCreatePayloadDto
  implements IMenteeFeedbackCreateRequest
{
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
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content?: string;
}
