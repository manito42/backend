import { Injectable } from '@nestjs/common';
import { UserCreatePayloadDto } from './dto/request/userCreatePayload.dto';
import { UserUpdatePayloadDto } from './dto/request/userUpdatePayload.dto';
import { UserGetResponseDto } from './dto/response/userGetResponse.dto';
import { UserReservationGetDto } from './dto/response/userReservationGet.dto';
import { UserRepository } from '../../database/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findMany(take: number, page: number): Promise<Array<UserGetResponseDto>> {
    return this.userRepository.findMany(take, page);
  }

  async findById(id: number): Promise<UserGetResponseDto> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserGetResponseDto> {
    return this.userRepository.findByEmail(email);
  }

  async findByNickname(nickname: string): Promise<UserGetResponseDto> {
    return this.userRepository.findByNickname(nickname);
  }

  // only for admin
  async create(data: UserCreatePayloadDto): Promise<UserGetResponseDto> {
    return this.userRepository.create(data);
  }

  async update(id: number, data: UserUpdatePayloadDto): Promise<UserGetResponseDto> {
    return this.userRepository.update(id, data);
  }

  async findUserReservation(
    id: number,
    take: number,
    page: number,
    as_mentor: boolean,
    as_mentee: boolean,
    active: boolean,
  ): Promise<UserReservationGetDto> {
    return this.userRepository.findUserReservation(id, take, page, as_mentor, as_mentee, active);
  }
}
