import { Module } from '@nestjs/common';
import { MentorProfileController } from './mentorProfile.controller';
import { MentorProfileService } from './mentorProfile.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { MentorProfileRepository } from '../../database/repository/mentorProfile.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MentorProfileController],
  providers: [MentorProfileService, MentorProfileRepository],
  exports: [MentorProfileService, MentorProfileRepository],
})
export class MentorProfileModule {}
