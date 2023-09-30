import { DynamicModule, Global, Module } from '@nestjs/common';
import { DevModule } from '../dev/dev.module';
import { AuthModule } from './auth.module';

@Global()
@Module({})
export class AuthDynamicModule {
  static forRoot(): DynamicModule {
    const isDev = process.env.NODE_ENV === 'dev';

    const imports = isDev ? [AuthModule, DevModule] : [AuthModule];

    return {
      module: AuthDynamicModule,
      imports,
    };
  }
}
