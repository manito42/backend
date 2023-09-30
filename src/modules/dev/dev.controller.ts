import { Controller, Get, Param, Res, UnauthorizedException } from '@nestjs/common';
import * as process from 'process';
import { AppConfigService } from 'src/config/app/config.service';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Get('/login/:id')
  async loginDev(@Param('id') id: number, @Res() res) {
    if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test')
      throw new UnauthorizedException();
    const user = await this.devService.createOrGetUser(id);
    const accessToken = await this.devService.createToken(user);
    res.redirect(`${this.appConfigService.accessUrl}/SignIn?uid=${user.id}&token=${accessToken}`);
  }
}
