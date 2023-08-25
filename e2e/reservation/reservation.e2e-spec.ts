import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ReservationRepository } from '../../src/database/repository/reservation.repository';
import { ReservationModule } from '../../src/models/reservation/reservation.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../../src/database/services/prisma.service';
import { ValidationOptions } from '../../src/common/pipes/validationPipe/validationOptions.constant';
import { PrismaClientExceptionFilter } from '../../src/common/filters/prismaClientException.filter';
import { User } from '@prisma/client';
import { Category, Hashtag, MentorProfile } from '.prisma/client';
import { DevModule } from '../../src/modules/dev/dev.module';

/**
 * @description
 * - Reservation 모델의 Get/Patch 테스트
 * */
describe('Reservation - Get/Patch', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mentor: User;
  let mentorProfile: MentorProfile;
  let mentee: User;
  let category: Category;
  let hashtag: Hashtag;
  let mentorAccessToken: string;
  let menteeAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ReservationModule, DevModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(ValidationOptions));
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    mentor = await prisma.user.create({
      data: {
        email: 'ReservationMentor@gmail.com',
        nickname: 'ReservationMentor',
        profileImage: 'ReservationMentor.png',
        role: 'USER',
      },
    });

    mentee = await prisma.user.create({
      data: {
        email: 'ReservationMentee@gmail.com',
        nickname: 'ReservationMentee',
        profileImage: 'ReservationMentee.png',
        role: 'USER',
      },
    });

    category = await prisma.category.create({
      data: {
        name: 'ReservationTestCategory',
      },
    });

    hashtag = await prisma.hashtag.create({
      data: {
        name: 'ReservationTestHashtag',
      },
    });

    await prisma.mentorProfile.create({
      data: {
        userId: mentor.id,
        shortDescription: 'ReservationMentorShortDescription',
        description: 'ReservationMentorDescription',
        isHide: false,
        mentoringCount: 0,
      },
    });

    const mentorResponse = await request(app.getHttpServer()).get(`/dev/login/${mentor.id}`);
    const menteeResponse = await request(app.getHttpServer()).get(`/dev/login/${mentee.id}`);

    mentorAccessToken = mentorResponse.body.accessToken;
    menteeAccessToken = menteeResponse.body.accessToken;
  });

  afterAll(async () => {
    await prisma.reservation.deleteMany({
      where: {
        mentorId: mentor.id,
      },
    });

    await prisma.mentorProfile.deleteMany({
      where: {
        userId: mentor.id,
      },
    });

    await prisma.user.deleteMany({
      where: {
        OR: [{ id: mentee.id }, { id: mentor.id }],
      },
    });

    await prisma.category.deleteMany({
      where: {
        id: category.id,
      },
    });

    await prisma.hashtag.deleteMany({
      where: {
        id: hashtag.id,
      },
    });

    await prisma.$disconnect();
    await app.close();
  });

  describe('Request a new reservation', () => {
    it('POST /reservations', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [hashtag.id],
        });

      console.log(response);
      expect(response.body).toHaveProperty('id');
    });
  });

  /**
   * @description
   * - 모든 예약 정보를 가져온다.
   * */
  describe('Get All Reservations', () => {
    it.todo('should return all reservations');
  });

  /**
   * @description
   * - 예약 ID로 예약 정보를 가져온다.
   */
  describe('Get a reservation by ID', () => {
    it.todo('should return a reservation by ID');
  });

  /**
   * @description
   * - 예약 ID로 예약 정보를 수정한다.
   */
  describe('Update a reservation', () => {
    it.todo('should update a reservation by ID');
  });
});
