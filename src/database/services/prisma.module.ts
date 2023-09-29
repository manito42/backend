import { Module } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { HashtagRepository } from '../repository/hashtag.repository';
import { MenteeFeedbackRepository } from '../repository/menteeFeedback.repository';
import { MentorFeedbackRepository } from '../repository/mentorFeedback.repository';
import { MentorProfileRepository } from '../repository/mentorProfile.repository';
import { ReservationRepository } from '../repository/reservation.repository';
import { UserRepository } from '../repository/user.repository';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    PrismaService,
    CategoryRepository,
    HashtagRepository,
    MenteeFeedbackRepository,
    MentorFeedbackRepository,
    MentorProfileRepository,
    ReservationRepository,
    UserRepository,
  ],
  exports: [
    PrismaService,
    CategoryRepository,
    HashtagRepository,
    MenteeFeedbackRepository,
    MentorFeedbackRepository,
    MentorProfileRepository,
    ReservationRepository,
    UserRepository,
  ],
})
export class PrismaModule {}
