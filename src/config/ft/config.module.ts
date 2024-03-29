import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { FtConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_FILE } from '../envFile.constant';
import { FtStrategy } from 'src/common/guards/ft/ft.strategy';
import { FtGuard } from 'src/common/guards/ft/ft.guard';

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
        FT_CLIENT: Joi.string().required(),
        FT_SECRET: Joi.string().required(),
        FT_CALLBACK: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, FtConfigService, FtStrategy, FtGuard],
  exports: [ConfigService, FtConfigService, FtGuard],
})
export class FtConfigModule {}
