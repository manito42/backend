import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { MentorProfileModule } from '../../models/mentorProfile/mentorProfile.module';
import { MentorProfileService } from '../../models/mentorProfile/mentorProfile.service';
import { PrismaService } from '../../database/services/prisma.service';

@Module({
  imports: [MentorProfileModule],
  controllers: [HomeController],
  providers: [HomeService, MentorProfileService, PrismaService],
})
export class HomeModule {}
