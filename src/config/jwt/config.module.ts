import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { JwtConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_FILE } from '../envFile.constant';
import { JwtStrategy } from 'src/common/guards/jwt/jwt.strategy';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV_FILE[process.env.NODE_ENV],
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, JwtConfigService, JwtStrategy, JwtGuard],
  exports: [ConfigService, JwtConfigService, JwtGuard],
})
export class JwtConfigModule {}
