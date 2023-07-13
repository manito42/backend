import { IsEmail, IsEnum, IsOptional, IsUrl, Matches, MinLength } from 'class-validator';
import { IUserCreateRequest } from '../../../../common/interfaces/api/user/userRequest.interface';
import { UserRole } from '@prisma/client';

export class UserCreatePayloadDto implements IUserCreateRequest {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  @MinLength(4, { message: '이메일은 4글자 이상이어야 합니다.' })
  email: string;

  // Matches Korean + Alphabet + Number + 2~20
  @Matches(/^[a-zA-Z0-9]{2,20}$/, {
    message: '영문, 숫자 4~20글자여야 합니다.',
  })
  nickname: string;

  @IsUrl({ require_tld: false }, { message: '형식에 맞지 않는 url 입니다.' })
  profileImage: string;

  @IsEnum(UserRole, { message: '잘못된 권한입니다.' })
  role: UserRole;
}
