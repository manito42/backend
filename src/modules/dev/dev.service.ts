import { Injectable } from '@nestjs/common';
import { UserGetResponseDto } from '../../models/user/dto/response/userGetResponse.dto';
import { JwtPayloadInterface } from '../../common/interfaces/jwt/jwtPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserCreatePayloadDto } from 'src/models/user/dto/request/userCreatePayload.dto';
import { UserService } from 'src/models/user/user.service';

@Injectable()
export class DevService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // fixed fake user for dev
  async verifyOrCreateFakeUser(newFakeUser: UserCreatePayloadDto): Promise<UserGetResponseDto> {
    const { nickname } = newFakeUser;
    const userExist = await this.userService.findByNickname(nickname);
    if (!userExist) {
      return await this.userService.create(newFakeUser);
    } else {
      return await this.userService.updateLastLogin(userExist.id);
    }
  }

  async createToken(user: UserGetResponseDto): Promise<string> {
    // create jwt token and return it
    const payload: JwtPayloadInterface = {
      id: user.id,
      nickname: user.nickname,
      role: user.role,
      profileImage: user.profileImage,
    };
    return this.jwtService.sign(payload);
  }
}
