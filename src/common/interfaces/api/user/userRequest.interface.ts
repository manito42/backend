import { UserRole } from '@prisma/client';

export interface IUserCreateRequest {
  email: string;
  nickname: string;
  profileImage: string;
  role: UserRole;
}

export interface IUserUpdateRequest {
  profileImage?: string;
}
