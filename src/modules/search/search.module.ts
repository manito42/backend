import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import {MentorProfileModule} from "../../models/mentorProfile/mentorProfile.module";
import {MentorProfileService} from "../../models/mentorProfile/mentorProfile.service";
import {PrismaService} from "../../database/services/prisma.service";

@Module({
  controllers: [SearchController],
  imports: [MentorProfileModule],
  providers: [MentorProfileService, PrismaService],
})
export class SearchModule {}
