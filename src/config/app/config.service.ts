import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('app.port');
  }

  get host(): string {
    return this.configService.get<string>('app.host');
  }

  get accessUrl(): string {
    return this.configService.get<string>('app.accessUrl');
  }

  get apiUrl(): string {
    return this.configService.get<string>('app.apiUrl');
  }
}
