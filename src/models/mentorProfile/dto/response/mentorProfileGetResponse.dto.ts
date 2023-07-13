import { IMentorProfileResponse } from '../../../../common/interfaces/api/mentorProfile/mentorProfileResponse.interface';

export class MentorProfileGetResponseDto implements IMentorProfileResponse {
  id: number;
  isHide: boolean;
  shortDescription: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  hashtags: {
    id: number;
    name: string;
  }[];
  categories: {
    id: number;
    name: string;
  }[];
  user: {
    id: number;
    nickname: string;
    profileImage: string;
  };
}
