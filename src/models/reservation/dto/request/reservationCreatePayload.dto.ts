import { ArrayMaxSize, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { Hashtag } from '@prisma/client';
import { IReservationCreateRequest } from '../../../../common/interfaces/api/reservation/reservationRequest.interface';

export class ReservationCreatePayloadDto implements IReservationCreateRequest {
  @IsNumber({}, { message: '멘토 아이디는 숫자여야 합니다.' })
  mentorId: number;
  @IsNumber({}, { message: '멘티 아이디는 숫자여야 합니다.' })
  menteeId: number;
  @IsNumber({}, { message: '카테고리 아이디는 숫자여야 합니다.' })
  categoryId: number;
  @IsOptional()
  @MaxLength(1000, { message: '요청 메세지는 1000자 이하로 입력해주세요.' })
  requestMessage?: string;
  @IsOptional()
  @ArrayMaxSize(5, { message: '해시태그는 5개 이하로 입력해주세요.' })
  hashtags?: Array<Hashtag>;
}
