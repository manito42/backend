import { PrismaClient } from '@prisma/client';
import * as child_process from 'child_process';
import { CategoryFactory } from '../factories/category.factory';
import { HashtagFactory } from '../factories/hashtag.factory';
import { MenteeFeedbackFactory } from '../factories/menteeFeedback.factory';
import { MentorFeedbackFactory } from '../factories/mentorFeedback.factory';
import { MentorProfileFactory } from '../factories/mentorProfile.factory';
import { ReservationFactory } from '../factories/reservation.factory';
import { UserFactory } from '../factories/user.factory';
import * as util from 'util';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class Seeder {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async clear() {
    const exec = util.promisify(child_process.exec);
    const command = 'npx prisma migrate reset --force';
    try {
      const { stdout, stderr } = await exec(command);
      console.debug(stdout);
    } catch (e) {
      console.error(e);
      throw new Error('failed to clear database');
    }
  }

  async seed(userCount: number, hashtagCount: number, reservationCount: number) {
    await this.seedUsers(userCount, this.prisma);
    await this.seedCategories(this.prisma);
    await this.seedHashtags(hashtagCount, this.prisma);
    await this.seedMentorProfiles(this.prisma);
    await this.seedReservations(reservationCount, this.prisma);
    await this.seedMenteeFeedbacks(this.prisma);
    await this.seedMentorFeedbacks(this.prisma);
  }

  async seedCategories(prisma: PrismaClient) {
    console.debug('seeding categories');
    const categories = CategoryFactory.getRealSeed();
    await prisma.category.createMany({
      data: categories,
    });
    console.debug('seeding categories done');
  }

  async seedHashtags(count: number, prisma: PrismaClient) {
    console.debug('seeding hashtags');
    const hashtagData = HashtagFactory.getCreateHashTags(count);
    await prisma.hashtag.createMany({
      data: hashtagData,
    });
    console.debug('seeding hashtags done');
  }
  async seedMenteeFeedbacks(prisma: PrismaClient) {
    console.debug('seeding menteeFeedbacks');
    const reservations = await prisma.reservation.findMany({});
    const menteeFeedbacks = MenteeFeedbackFactory.getCreateMenteeFeedbacks(reservations);
    await prisma.menteeFeedback.createMany({ data: menteeFeedbacks });
    console.debug('seeding menteeFeedbacks done');
  }
  async seedMentorFeedbacks(prisma: PrismaClient) {
    console.debug('seeding mentorFeedbacks');
    const reservations = await prisma.reservation.findMany({});
    const mentorFeedbacks = MentorFeedbackFactory.getCreateMentorFeedbacks(reservations);
    await prisma.mentorFeedback.createMany({ data: mentorFeedbacks });
    console.debug('seeding mentorFeedbacks done');
  }

  async seedMentorProfiles(prisma: PrismaClient) {
    console.debug('seeding mentorProfiles');
    console.debug('creating mentorProfiles');
    const mentors = await prisma.user.findMany({
      where: {
        isMentor: true,
      },
    });
    const hashtags = await prisma.hashtag.findMany({ take: 3 });
    const mentorProfiles = MentorProfileFactory.getCreateMentorProfiles(mentors);
    await prisma.mentorProfile.createMany({
      data: mentorProfiles,
    });
    console.debug('creating mentorProfiles done');
    console.debug('connecting hashtags to mentorProfiles');
    const createdProfiles = await prisma.mentorProfile.findMany();
    // connect hashtags and categories to mentorProfiles
    for (const profile of createdProfiles) {
      await prisma.mentorProfile.update({
        where: {
          id: profile.id,
        },
        data: {
          hashtags: {
            connect: hashtags.map((hashtag) => {
              return { id: hashtag.id };
            }),
          },
          categories: {
            connect: [
              {
                id: Math.random() > 0.5 ? 1 : 2,
              },
            ],
          },
        },
      });
    }
    console.debug('connecting hashtags to mentorProfiles done');
    console.debug('seeding mentorProfiles done');
  }

  async seedReservations(count: number, prisma: PrismaClient) {
    console.debug('seeding reservations');
    const users = await prisma.user.findMany({});
    const mentors = await prisma.user.findMany({ where: { isMentor: true } });
    const reservationData = ReservationFactory.getCreateReservations(count, users, mentors);
    console.debug('creating reservations');
    await prisma.reservation.createMany({
      data: reservationData,
    });
    console.debug('creating reservations done');
    // connect hashtags and categories to reservation
    console.debug('connecting hashtags to reservations');
    const createdReservations = await prisma.reservation.findMany();
    const hashtags = await prisma.hashtag.findMany({ take: 3 });
    for (const reservation of createdReservations) {
      await prisma.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          hashtags: {
            connect: {
              id: hashtags[reservation.id % hashtags.length].id,
            },
          },
        },
      });
    }
    console.debug('connecting hashtags to reservations done');
    console.debug('seeding reservations done');
  }

  async seedUsers(n: number, prisma: PrismaClient) {
    console.debug('seeding users');
    const users = UserFactory.getCreateUsers(n);
    await prisma.user.createMany({ data: users });
    console.debug('seeding users done');
  }
}
