import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from '../../common/guards/ft/ft.guard';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { JwtPayloadInterface } from '../../common/interfaces/jwt/jwtPayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FtGuard)
  @Get('42')
  async get42AuthUrl() {}

  @UseGuards(FtGuard)
  @Get('42/callback')
  async get42AuthCallback(@Req() req) {
    if (!req.user || !req.user.nickname) throw new UnauthorizedException();
    const user = await this.authService.verifyOrCreateUser(req.user);
    if (!user) throw new InternalServerErrorException();
    const accessToken = await this.authService.createToken(user);
    return {
      accessToken: accessToken,
    };
  }

  // 정상적으로 토큰을 발급받았다면, 에러가 발생하지 않습니다.
  @UseGuards(JwtGuard)
  @Get('/')
  async login(@Req() req): Promise<JwtPayloadInterface> {
    return req.user;
  }
}
