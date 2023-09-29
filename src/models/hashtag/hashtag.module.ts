import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { JwtConfigModule } from 'src/config/jwt/config.module';

@Module({
  imports: [PrismaModule, JwtConfigModule],
  controllers: [HashtagController],
  providers: [HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}
