import { ArrayMaxSize, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { Hashtag, ReservationStatus } from '@prisma/client';
import { IReservationUpdateRequest } from '../../../../common/interfaces/api/reservation/reservationRequest.interface';

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
