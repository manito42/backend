import { IsString, MaxLength, MinLength } from 'class-validator';
import { IHashtagRequest } from '../../../../common/interfaces/api/hashtag/hashtagRequest.interface';

export class HashtagCreatePayloadDto implements IHashtagRequest {
  // alphabet only
  @MinLength(2, { message: '해시태그는 2byte 이상 입력해주세요.' })
  @MaxLength(30, { message: '해시태그는 30byte 이하 입력해주세요.' })
  @IsString()
  name: string;
}
