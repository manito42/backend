import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IMentorProfileUpdateRequest } from '../../../../common/interfaces/api/mentorProfile/mentorProfileRequest.interface';

export class MentorProfileUpdatePayloadDto implements IMentorProfileUpdateRequest {
  @MinLength(0, { message: 'shortDescription은 최소 0글자 이상이어야 합니다.' })
  @MaxLength(50, {
    message: 'shortDescription은 최대 50자 이하여야 합니다.',
  })
  shortDescription: string;

  @MinLength(0, { message: 'description은 최소 0글자 이상이어야 합니다.' })
  @MaxLength(1000, {
    message: 'description은 최대 1000자 이하여야 합니다.',
  })
  description: string;

  @ArrayMaxSize(5, { message: '해시태그는 5개 이하로 입력해주세요.' })
  hashtags: { id: number }[];

  @IsArray()
  categories: { id: number }[];

  @IsString()
  @IsOptional()
  @Matches('https://42born2code.slack.com/team/[a-zA-Z0-9_-]+')
  socialLink: string;
}
