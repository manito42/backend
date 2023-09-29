import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtConfigModule } from '../../config/ft/config.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../models/user/user.module';
import { JwtConfigModule } from '../../config/jwt/config.module';
import { JwtConfigService } from '../../config/jwt/config.service';
import { AppConfigModule } from '../../config/app/config.module';

@Module({
  imports: [
    FtConfigModule,
    AppConfigModule,
    UserModule,
    JwtConfigModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
        signOptions: {
          expiresIn: jwtConfigService.expiresIn,
          algorithm: 'HS256',
          issuer: 'manito42',
        },
      }),
      inject: [JwtConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
