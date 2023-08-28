import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HashtagController],
  providers: [HashtagService],
})
export class HashtagModule {}
