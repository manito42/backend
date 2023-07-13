import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtGuard } from '../../common/guards/ft/ft.guard';
import { FtStrategy } from '../../common/guards/ft/ft.strategy';
import { FtConfigModule } from '../../config/ft/config.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { JwtStrategy } from '../../common/guards/jwt/jwt.strategy';
import { UserModule } from '../../models/user/user.module';
import { JwtConfigModule } from '../../config/jwt/config.module';
import { JwtConfigService } from '../../config/jwt/config.service';

@Module({
  imports: [
    FtConfigModule,
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
  providers: [AuthService, FtGuard, FtStrategy, JwtGuard, JwtStrategy],
})
export class AuthModule {}
