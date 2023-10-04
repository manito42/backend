export interface IMentorProfileCreateRequest {
  userId: number;
}

export interface IMentorProfileUpdateRequest {
  shortDescription?: string;
  description?: string;
  hashtags?: { id: number }[];
  categories?: { id: number }[];
  isHide?: boolean;
  socialLink?: string;
}
