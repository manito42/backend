import {
  ArrayMaxSize,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { IReservationUpdateRequest } from '../../../../common/interfaces/api/reservation/reservationRequest.interface';
import { IsMultiple } from '../../../../common/decorators/IsMultiple';

export class ReservationUpdatePayloadDto implements IReservationUpdateRequest {
  @IsOptional()
  @MaxLength(1000, { message: '요청 메세지는 1000자 이하로 입력해주세요.' })
  requestMessage?: string;
  @IsOptional()
  @ArrayMaxSize(5, { message: '해시태그는 5개 이하로 입력해주세요.' })
  hashtags?: { id: number }[];
  @IsOptional()
  categoryId?: number;
  @IsOptional()
  @IsEnum(ReservationStatus, { message: '올바른 예약 상태가 아닙니다.' })
  status?: ReservationStatus;
}

export class ReservationCancelPayloadDto {
  @IsString()
  @MaxLength(100, { message: '취소 사유는 100자 이하로 입력해주세요.' })
  content: string;
}

export class ReservationCompleteAsMentorPayloadDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsMultiple(0.5, { message: 'rating 은 0.5의 배수입니다.' })
  rating: number;
}

export class ReservationCompleteAsMenteePayloadDto {
  @IsNumber()
  @Min(0, { message: 'rating 은 0 <= rating <= 5 입니다.' })
  @Max(5, { message: 'rating 은 0 <= rating <= 5 입니다.' })
  @IsMultiple(0.5, { message: 'rating 은 0.5의 배수입니다.' })
  rating: number;

  @IsString()
  @MaxLength(300, { message: '피드백 메시지는 300자 이하로 입력해주세요.' })
  content: string;
}
