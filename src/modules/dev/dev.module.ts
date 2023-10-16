import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { UserModule } from '../../models/user/user.module';
import { PrismaModule } from '../../database/services/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigModule } from '../../config/jwt/config.module';
import { JwtConfigService } from '../../config/jwt/config.service';
import { AppConfigModule } from 'src/config/app/config.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
        signOptions: {
          expiresIn: jwtConfigService.expiresIn,
          algorithm: 'HS256',
          issuer: 'manito42DEV',
        },
      }),
      inject: [JwtConfigService],
    }),
  ],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule {}
