export interface IMentorProfileResponse {
  id: number;
  shortDescription: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isHide: boolean;

  mentoringCount: number;
  ratingSum: number;

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
