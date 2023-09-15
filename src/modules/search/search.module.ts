import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { MentorProfileModule } from '../../models/mentorProfile/mentorProfile.module';
import { MentorProfileService } from '../../models/mentorProfile/mentorProfile.service';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  controllers: [SearchController, PrismaModule],
  imports: [MentorProfileModule],
  providers: [MentorProfileService],
})
export class SearchModule {}
