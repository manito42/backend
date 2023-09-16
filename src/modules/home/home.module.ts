import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { MentorProfileModule } from '../../models/mentorProfile/mentorProfile.module';
import { MentorProfileService } from '../../models/mentorProfile/mentorProfile.service';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  imports: [MentorProfileModule, PrismaModule],
  controllers: [HomeController],
  providers: [HomeService, MentorProfileService],
})
export class HomeModule {}
