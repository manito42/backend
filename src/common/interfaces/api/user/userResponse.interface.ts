export interface IUserResponse {
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  role: string;
  isMentor: boolean;
  createdAt: Date;
  updatedAt: Date;
  mentorProfile?: {
    id: number;
    shortDescription: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    mentoringCount: number;
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
