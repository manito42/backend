import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { MentorProfileModule } from '../../models/mentorProfile/mentorProfile.module';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  imports: [MentorProfileModule, PrismaModule],
  controllers: [HomeController],
})
export class HomeModule {}
