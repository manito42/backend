import {
  IsEmail,
  IsOptional,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  @MinLength(4, { message: '이메일은 4글자 이상이어야 합니다.' })
  email?: string;

  // Matches Korean + Alphabet + Number + 2~20
  @IsOptional()
  @Matches(/^[가-힣a-zA-Z0-9]{2,20}$/, {
    message: '닉네임은 영문, 숫자 4~20글자여야 합니다.',
  })
  nickname?: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: '형식에 맞지 않는 url 입니다.' })
  profileImage?: string;

  @IsOptional()
  isMentor?: boolean = false;
}
