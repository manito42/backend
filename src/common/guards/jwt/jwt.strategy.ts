import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfigService } from '../../../config/jwt/config.service';
import { JwtPayloadInterface } from '../../interfaces/jwt/jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // passport-jwt strategy 를 통해서 jwt token 을 검증 & payload 를 추출
  constructor(private jwtConfigService: JwtConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req): string => {
          return req?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.secret,
    });
  }

  // 검증된 JWT 토큰인 경우 존재하는 유저로 확정하고, 접근을 허용합니다.
  async validate(payload: JwtPayloadInterface) {
    return payload;
  }
}
