import { Injectable } from '@nestjs/common';
import { UserGetResponseDto } from '../../models/user/dto/response/userGetResponse.dto';
import { JwtPayloadInterface } from '../../common/interfaces/jwt/jwtPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/database/repository/user.repository';
import { UserRole } from '@prisma/client';
@Injectable()
export class DevService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async createOrGetUser(userId: number) {
    // check if user exists
    const user = await this.userRepository.findById(userId);
    if (user) {
      return user;
    }
    // create user
    const newUser = await this.userRepository.create({
      nickname: `manitoDevUser${userId}`,
      email: `42manito${userId}@gmail.com`,
      profileImage: 'https://cdn.intra.42.fr/users/medium_manito.jpg',
      role: UserRole.USER,
    });
    return newUser;
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
