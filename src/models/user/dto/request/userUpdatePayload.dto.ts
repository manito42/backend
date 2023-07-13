import { IsOptional, IsUrl } from 'class-validator';
import { IUserUpdateRequest } from '../../../../common/interfaces/api/user/userRequest.interface';

export class UserUpdatePayloadDto implements IUserUpdateRequest {
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: '형식에 맞지 않는 url 입니다.' })
  profileImage?: string;

  @IsOptional()
  isMentor?: boolean = false;
}
