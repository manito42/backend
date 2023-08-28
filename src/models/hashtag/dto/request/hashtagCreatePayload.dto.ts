import { IsAlpha, MaxLength, MinLength } from 'class-validator';
import { IHashtagRequest } from '../../../../common/interfaces/api/hashtag/hashtagRequest.interface';

export class HashtagCreatePayloadDto implements IHashtagRequest {
  // alphabet only
  @MinLength(2, { message: '해시태그는 2자 이상 입력해주세요.' })
  @MaxLength(20, { message: '해시태그는 20자 이하로 입력해주세요.' })
  @IsAlpha('en-US', { message: '해시태그는 영어만 입력해주세요.' })
  name: string;
}
