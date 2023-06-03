export interface IHomeResponse {
  id: number;
  shortDescription: string;
  description: string;
  hashtags: {
    id: number;
    name: string;
  }[];
  categories: {
    id: number;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isHide: boolean;
}
