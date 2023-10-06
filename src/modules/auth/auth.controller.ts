import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from '../../common/guards/ft/ft.guard';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { JwtPayloadInterface } from '../../common/interfaces/jwt/jwtPayload.interface';
import { AppConfigService } from '../../config/app/config.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @UseGuards(FtGuard)
  @Get('42')
  async get42AuthUrl() {}

  @UseGuards(FtGuard)
  @Get('42/callback')
  async get42AuthCallback(@Req() req, @Res() res: Response) {
    if (!req.user || !req.user.nickname) {
      res.redirect(`${this.appConfigService.accessUrl}?uid=0`);
    }

    const user = await this.authService.verifyOrCreateUser(req.user);
    const accessToken = await this.authService.createToken(user);

    res.redirect(`${this.appConfigService.accessUrl}/SignIn?uid=${user.id}&token=${accessToken}`);
  }

  // 정상적으로 토큰을 발급받았다면, 에러가 발생하지 않습니다.
  @UseGuards(JwtGuard)
  @Get('/')
  async login(@Req() req): Promise<JwtPayloadInterface> {
    return req.user;
  }
}
