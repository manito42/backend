import { IUserResponse } from '../../../../common/interfaces/api/user/userResponse.interface';

export class UserGetResponseDto implements IUserResponse {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  mentoringCount: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  mentorProfile: {
    id: number;
    shortDescription: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    mentoringCount: number;
    isHide: boolean;
    socialLink: string;
    hashtags: {
      id: number;
      name: string;
    }[];
    categories: {
      id: number;
      name: string;
    }[];
  };
}
