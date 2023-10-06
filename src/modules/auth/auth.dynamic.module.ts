import { DynamicModule, Global, Module } from '@nestjs/common';
import { DevModule } from '../dev/dev.module';
import { AuthModule } from './auth.module';

@Global()
@Module({})
export class AuthDynamicModule {
  static forRoot(): DynamicModule {
    const enableDevModule = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test';

    const imports = enableDevModule ? [AuthModule, DevModule] : [AuthModule];

    return {
      module: AuthDynamicModule,
      imports,
    };
  }
}
