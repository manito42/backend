import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUsers(
    @Query('take') take: number = 20,
    @Query('page') page: number = 0,
  ): Promise<Array<User>> {
    return await this.userService.getUsers(take, page);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Post('/')
  async createUser(@Body() payload: UserCreateDto): Promise<User> {
    return await this.userService.createUser(payload);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() payload: UserUpdateDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, payload);
  }

  @Get('/verify_nickname/:nickname')
  async verifyNickname(@Param('nickname') nickname: string): Promise<void> {
    return await this.userService.verifyNickname(nickname);
  }
}
