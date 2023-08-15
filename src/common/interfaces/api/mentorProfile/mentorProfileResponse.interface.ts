export interface IMentorProfileResponse {
  id: number;
  userId: number;
  shortDescription: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isHide: boolean;
  mentoringCount: number;
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
