import { Module } from '@nestjs/common';
import { MentorProfileController } from './mentorProfile.controller';
import { MentorProfileService } from './mentorProfile.service';
import { PrismaModule } from '../../database/services/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MentorProfileController],
  providers: [MentorProfileService],
})
export class MentorProfileModule {}
