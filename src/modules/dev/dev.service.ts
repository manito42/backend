import { Injectable } from '@nestjs/common';
import { UserGetResponseDto } from '../../models/user/dto/response/userGetResponse.dto';
import { JwtPayloadInterface } from '../../common/interfaces/jwt/jwtPayload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class DevService {
  constructor(private readonly jwtService: JwtService) {}
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
