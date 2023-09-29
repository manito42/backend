import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { MentorProfileModule } from '../../models/mentorProfile/mentorProfile.module';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  imports: [PrismaModule, MentorProfileModule],
  controllers: [SearchController],
})
export class SearchModule {}
