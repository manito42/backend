import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../../src/database/services/prisma.service';
import { ValidationOptions } from '../../src/common/pipes/validationPipe/validationOptions.constant';
import { PrismaClientExceptionFilter } from '../../src/common/filters/prismaClientException.filter';
import { User } from '@prisma/client';
import { Category, Hashtag, MentorProfile, Reservation } from '.prisma/client';
import { AppModule } from 'src/app.module';

/**
 * @description
 * - Reservation 모델의 Get/Patch 테스트
 * */
describe('Reservation - Request', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mentor: User;
  let mentorProfile: MentorProfile;
  let mentee: User;
  let dummyMentee: User;
  let category: Category;
  let category2: Category;
  let category3: Category;
  let hashtag: Hashtag;
  let hashtag2: Hashtag;
  let hashtag3: Hashtag;
  let mentorAccessToken: string;
  let menteeAccessToken: string;
  let dummyMenteeAccToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(ValidationOptions));
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    mentor = await prisma.user.create({
      data: {
        email: 'myukang@student.42seoul.kr',
        nickname: 'ReservationMentor',
        profileImage: 'ReservationMentor.png',
        role: 'USER',
      },
    });

    mentee = await prisma.user.create({
      data: {
        email: 'myunghwan0421@gmail.com',
        nickname: 'ReservationMentee',
        profileImage: 'ReservationMentee.png',
        role: 'USER',
      },
    });

    dummyMentee = await prisma.user.create({
      data: {
        email: 'ReservationDummyMentee@gmail.com',
        nickname: 'ReservationDummyMentee',
        profileImage: 'ReservationDummyMentee.png',
        role: 'USER',
      },
    });

    category = await prisma.category.create({
      data: {
        name: 'ReservationTestCategory',
      },
    });

    category2 = await prisma.category.create({
      data: {
        name: 'ReservationTestCategory2',
      },
    });

    category3 = await prisma.category.create({
      data: {
        name: 'ReservationTestCategory3',
      },
    });

    hashtag = await prisma.hashtag.create({
      data: {
        name: 'ReservationTestHashtag',
      },
    });

    hashtag2 = await prisma.hashtag.create({
      data: {
        name: 'ReservationTestHashtag2',
      },
    });

    hashtag3 = await prisma.hashtag.create({
      data: {
        name: 'ReservationTestHashtag3',
      },
    });

    mentorProfile = await prisma.mentorProfile.create({
      data: {
        userId: mentor.id,
        shortDescription: 'ReservationMentorShortDescription',
        description: 'ReservationMentorDescription',
        isHide: false,
        mentoringCount: 0,
        categories: {
          connect: [
            {
              id: category.id,
            },
            {
              id: category2.id,
            },
          ],
        },
        hashtags: {
          connect: [
            {
              id: hashtag.id,
            },
            {
              id: hashtag2.id,
            },
          ],
        },
      },
    });

    const mentorResponse = await request(app.getHttpServer()).get(`/dev/login/${mentor.id}`);
    const menteeResponse = await request(app.getHttpServer()).get(`/dev/login/${mentee.id}`);
    const dummyMenteeResponse = await request(app.getHttpServer()).get(
      `/dev/login/${dummyMentee.id}`,
    );

    mentorAccessToken = mentorResponse.body.accessToken;
    menteeAccessToken = menteeResponse.body.accessToken;
    dummyMenteeAccToken = dummyMenteeResponse.body.accessToken;
  });

  afterEach(async () => {
    await prisma.mentorFeedback.deleteMany({
      where: {
        OR: [{ menteeId: mentee.id }, { mentorId: mentor.id }],
      },
    });

    await prisma.menteeFeedback.deleteMany({
      where: {
        OR: [{ menteeId: mentee.id }, { mentorId: mentor.id }],
      },
    });

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
        OR: [{ id: mentee.id }, { id: mentor.id }, { id: dummyMentee.id }],
      },
    });

    await prisma.category.deleteMany({
      where: {
        OR: [{ id: category.id }, { id: category2.id }, { id: category3.id }],
      },
    });

    await prisma.hashtag.deleteMany({
      where: {
        OR: [
          { id: hashtag.id },
          { id: hashtag2.id },
          {
            id: hashtag3.id,
          },
        ],
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create Request', () => {
    it('멘티가 예약을 생성한다 by category1', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }],
        });

      expect(response.status).toBe(201);
    });

    it('멘티가 예약을 생성 by category2', async () => {
      const response2 = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category2.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }],
        });

      expect(response2.status).toBe(201);
    });

    it('멘티가 예약 생성 시, 해시태그가 여러개인 경우 201반환', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }, { id: hashtag2.id }],
        });

      expect(response.status).toBe(201);
      expect(response.body.hashtags.length).toBe(2);
    });

    it('멘티가 예약을 생성할 때, 없는 카테고리인 경우 400 반환', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category3.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }],
        });

      expect(response.status).toBe(400);
    });

    it('멘티가 예약 생성시, 없는 해시태그인 경우 400 반환', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag3.id }],
        });

      expect(response.status).toBe(400);
    });

    it('멘티가 예약 생성시, 해시태그가 없는 경우 400 반환', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [],
        });

      expect(response.status).toBe(400);
    });

    it('멘티가 예약 생성시, 해시태그가 여러개인 경우, 없는 해시태그가 있을때 400반환', async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }, { id: hashtag3.id }],
        });

      expect(response.status).toBe(400);
    });

    it('멘토 프로필이 isHide일 때, 예약 생성 시도 시 400 반환', async () => {
      await prisma.mentorProfile.update({
        data: {
          isHide: true,
        },
        where: {
          userId: mentor.id,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }],
        });

      expect(response.status).toBe(400);

      // isHide를 false로 바꿔준다.
      await prisma.mentorProfile.update({
        data: {
          isHide: false,
        },
        where: {
          userId: mentor.id,
        },
      });
    });

    afterEach(async () => {
      await prisma.reservation.deleteMany({
        where: {
          mentorId: mentor.id,
        },
      });
    });
  });

  describe('Request', () => {
    let reservation: Reservation;
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }],
        });
      reservation = response.body;
    });

    afterEach(async () => {
      await prisma.reservation.deleteMany({
        where: {
          mentorId: mentor.id,
        },
      });
    });

    describe('Request -> Cancel By Mentee', () => {
      it('없는 예약을 취소한다. (404)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/999/cancel`)
          .send({
            content: '취소 테스트',
          })
          .set('Authorization', `Bearer ${menteeAccessToken}`);

        expect(response.status).toBe(400);
      });

      it('멘티가 예약 취소를 요청한다. (200)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/cancel`)
          .send({
            content: '취소 테스트2',
          })
          .set('Authorization', `Bearer ${menteeAccessToken}`);

        expect(response.status).toBe(200);
        const res = await prisma.reservation.findUnique({
          where: {
            id: reservation.id,
          },
        });
        expect(res.status).toBe('CANCEL');
      });
    });

    describe('Request -> Cancel By Mentor', () => {
      it('멘토가 예약 취소를 요청한다. (200)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/cancel`)
          .send({
            content: '취소 테스트3',
          })
          .set('Authorization', `Bearer ${mentorAccessToken}`);

        expect(response.status).toBe(200);
        const res = await prisma.reservation.findUnique({
          where: {
            id: reservation.id,
          },
        });
        expect(res.status).toBe('CANCEL');
      });
    });

    describe('Request -> Accept By Mentor', () => {
      it('멘토의 예약 수락', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/accept`)
          .set('Authorization', `Bearer ${mentorAccessToken}`);

        expect(response.status).toBe(200);
        const res = await prisma.reservation.findUnique({
          where: {
            id: reservation.id,
          },
        });
        expect(res.status).toBe('ACCEPT');
      });
    });
  });

  describe('Request - Accept', () => {
    let reservation: Reservation;
    //Accept된 예약 생성
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${menteeAccessToken}`)
        .send({
          menteeId: mentee.id,
          mentorId: mentor.id,
          categoryId: category.id,
          requestMessage: 'ReservationRequestMessage',
          hashtags: [{ id: hashtag.id }],
        });
      reservation = response.body;

      // 멘토가 예약을 수락한다.
      await request(app.getHttpServer())
        .patch(`/reservations/${reservation.id}/accept`)
        .set('Authorization', `Bearer ${mentorAccessToken}`);
    });

    describe('Accept -> Cancel By Mentor', () => {
      it('멘토가 예약을 취소한다.(200)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/cancel`)
          .send({
            content: '취소 테스트4',
          })
          .set('Authorization', `Bearer ${mentorAccessToken}`);

        expect(response.status).toBe(200);
      });
    });

    describe('Accept -> Cancel By Mentee', () => {
      it('멘티가 예약을 취소한다.(401)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/cancel`)
          .send({
            content: '취소 테스트5',
          })
          .set('Authorization', `Bearer ${menteeAccessToken}`);

        expect(response.status).toBe(401);
      });
    });

    describe('Accept -> Complete By Mentee', () => {
      it('참여하지 않은 멘티가 피드백을 남긴다.(401)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/mentee_completion`)
          .set('Authorization', `Bearer ${dummyMenteeAccToken}`)
          .send({
            rating: 5,
            content: 'ReservationComment',
          });
        expect(response.status).toBe(401);
      });

      it('멘티가 피드백을 남긴다.(200)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/mentee_completion`)
          .set('Authorization', `Bearer ${menteeAccessToken}`)
          .send({
            rating: 5,
            content: 'ReservationComment',
          });
        expect(response.status).toBe(200);
        const res = await prisma.reservation.findUnique({
          where: {
            id: reservation.id,
          },
        });
        expect(res.status).toBe('MENTEE_FEEDBACK');

        // 멘토가 피드백을 남긴다.
        const response2 = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/mentor_completion`)
          .set('Authorization', `Bearer ${mentorAccessToken}`)
          .send({
            rating: 5,
          });
        expect(response2.status).toBe(200);
        const res2 = await prisma.reservation.findUnique({
          where: {
            id: reservation.id,
          },
        });
        expect(res2.status).toBe('DONE');

        const menteeFeedback = await prisma.menteeFeedback.findUnique({
          where: {
            reservationId: reservation.id,
          },
        });
        expect(menteeFeedback.rating).toBe(5);

        const mentorFeedback = await prisma.mentorFeedback.findUnique({
          where: {
            reservationId: reservation.id,
          },
        });
        expect(mentorFeedback.rating).toBe(5);
      });
    });

    describe('Accept -> Checked By mentee', () => {
      it('참여하지 않은 멘티가 예약을 확인한다.(401)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/check`)
          .send({
            content: '취소 테스트6',
          })
          .set('Authorization', `Bearer ${dummyMenteeAccToken}`);

        expect(response.status).toBe(401);
      });

      it('멘티가 예약을 확인한다.(200)', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/reservations/${reservation.id}/check`)
          .set('Authorization', `Bearer ${menteeAccessToken}`);

        expect(response.status).toBe(200);

        const res = await prisma.reservation.findUnique({
          where: {
            id: reservation.id,
          },
        });
        expect(res.status).toBe('MENTEE_CHECKED');
      });
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
