import { IsBoolean } from 'class-validator';

export class MentorProfileActivateDto {
  @IsBoolean({ message: 'isHide는 boolean 타입이어야 합니다' })
  isHide: boolean;
}
