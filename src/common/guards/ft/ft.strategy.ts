import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { FtConfigService } from '../../../config/ft/config.service';
import axios from 'axios';
@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(private ftConfigService: FtConfigService) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?client_id=?${ftConfigService.client}&redirect_uri=${ftConfigService.callback}&response_type=code`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: ftConfigService.client,
      clientSecret: ftConfigService.secret,
      callbackURL: ftConfigService.callback,
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    // get profile information from 42 api
    const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const email = data.email;
    const login = data.login;
    const profileUrl = data.image.link;
    if (!email || !login) return false;
    return {
      email: email,
      nickname: login,
      profileImage: profileUrl,
    };
  }
}
