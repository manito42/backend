import { Injectable } from '@nestjs/common';
import { UserService } from '../../models/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '../../common/interfaces/jwt/jwtPayload.interface';
import { UserGetResponseDto } from '../../models/user/dto/response/userGetResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyOrCreateUser(user: any): Promise<UserGetResponseDto> {
    const { nickname } = user;
    let userExist = await this.userService.findByNickname(nickname);
    if (!userExist) {
      await this.userService.create(user);
      userExist = await this.userService.findByNickname(nickname);
    }
    return userExist;
  }

  async createToken(user: UserGetResponseDto): Promise<string> {
    // create jwt token and return it
    const payload: JwtPayloadInterface = {
      id: user.id,
      nickname: user.nickname,
      role: user.role,
      profileImage: user.profileImage,
    };
    return this.jwtService.signAsync(payload);
  }
}
