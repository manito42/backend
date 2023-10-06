import { Controller, Get, Param, Res, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { AppConfigService } from 'src/config/app/config.service';
import { UserCreatePayloadDto } from 'src/models/user/dto/request/userCreatePayload.dto';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(
    private readonly devService: DevService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Get('/login/:id')
  async loginDev(@Param('id') id: number, @Res() res: Response) {
    if (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test')
      throw new UnauthorizedException();

    // fixed fake user for dev
    const newFakeUser: UserCreatePayloadDto = {
      nickname: `manitoDevUser${id}`,
      email: `42manito${id}@gmail.com`,
      profileImage: 'https://cdn.intra.42.fr/users/medium_manito.jpg',
      role: UserRole.USER,
    };
    const fakeUser = await this.devService.verifyOrCreateFakeUser(newFakeUser);
    const accessToken = await this.devService.createToken(fakeUser);

    res.redirect(
      `${this.appConfigService.accessUrl}/SignIn?uid=${fakeUser.id}&token=${accessToken}`,
    );
  }
}
