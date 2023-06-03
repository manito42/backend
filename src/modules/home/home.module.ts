import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { MentorProfileModule } from '../../models/mentorProfile/mentorProfile.module';

@Module({
  imports: [MentorProfileModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
