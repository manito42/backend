import { Module } from '@nestjs/common';
import { MentorProfileController } from './mentorProfile.controller';
import { MentorProfileService } from './mentorProfile.service';
import { PrismaModule } from '../../database/services/prisma.module';
import { JwtConfigModule } from 'src/config/jwt/config.module';

@Module({
  imports: [PrismaModule, JwtConfigModule],
  controllers: [MentorProfileController],
  providers: [MentorProfileService],
  exports: [MentorProfileService],
})
export class MentorProfileModule {}
