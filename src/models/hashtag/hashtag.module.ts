import { Module } from '@nestjs/common';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { HashtagRepository } from '../../database/repository/hashtag.repository';

@Module({
  imports: [PrismaModule],
  controllers: [HashtagController],
  providers: [HashtagService, HashtagRepository],
  exports: [HashtagService, HashtagRepository],
})
export class HashtagModule {}
