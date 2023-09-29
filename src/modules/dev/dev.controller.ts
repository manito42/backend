import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import * as process from 'process';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Get('/login/:id')
  async loginDev(@Param('id') id: number) {
    if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test')
      throw new UnauthorizedException();
    const user = await this.devService.createOrGetUser(id);
    const accessToken = await this.devService.createToken(user);
    return {
      accessToken,
    };
  }
}
