import { ArrayMaxSize, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Category, Hashtag } from '@prisma/client';
import { IMentorProfileUpdateRequest } from '../../../../common/interfaces/api/mentorProfile/mentorProfileRequest.interface';

export class MentorProfileUpdatePayloadDto implements IMentorProfileUpdateRequest {
  @MinLength(1, { message: 'shortDescription은 최소 1글자 이상이어야 합니다.' })
  @MaxLength(50, {
    message: 'shortDescription은 최대 50자 이하여야 합니다.',
  })
  @IsOptional()
  shortDescription?: string;

  @MaxLength(1000, {
    message: 'description은 최대 1000자 이하여야 합니다.',
  })
  @MinLength(1, { message: 'description은 최소 1글자 이상이어야 합니다.' })
  @IsOptional()
  description?: string;

  @ArrayMaxSize(5, { message: '해시태그는 5개 이하로 입력해주세요.' })
  @IsOptional()
  hashtags?: { id: number }[];

  @IsOptional()
  categories?: { id: number }[];

  @IsOptional()
  isHide?: boolean;
}
