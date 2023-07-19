import { IUserResponse } from '../../../../common/interfaces/api/user/userResponse.interface';

export class UserGetResponseDto implements IUserResponse {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  isMentor: boolean;
  mentoringCount: number;
  ratingSum: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  mentorProfile?: {
    id: number;
    shortDescription: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    mentoringCount: number;
    ratingSum: number;
    isHide: boolean;
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
