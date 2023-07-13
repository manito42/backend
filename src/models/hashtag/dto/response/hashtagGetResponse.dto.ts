import { IHashtagResponse } from '../../../../common/interfaces/api/hashtag/hashtagResponse.interface';

export class HashtagGetResponseDto implements IHashtagResponse {
  id: number;
  name: string;
}
