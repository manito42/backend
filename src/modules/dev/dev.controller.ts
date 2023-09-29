import { BadRequestException, Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../models/user/user.service';
import * as process from 'process';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly userService: UserService,
  ) {}

  @Get('/login/:id')
  async loginDev(@Param('id') id: number) {
    if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test')
      throw new UnauthorizedException();
    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException();
    const accessToken = await this.devService.createToken(user);
    return {
      accessToken,
    };
  }
}
