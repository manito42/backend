import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/database/services/prisma.service';
import { User, MentorProfile, Category, Hashtag } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { MentorProfileUpdatePayloadDto } from '../../src/models/mentorProfile/dto/request/mentorProfileUpdatePayload.dto';
import { ValidationOptions } from '../../src/common/pipes/validationPipe/validationOptions.constant';
import { PrismaClientExceptionFilter } from '../../src/common/filters/prismaClientException.filter';

describe('PATCH /mentor-profiles test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mentor: User;
  let mentorProfile: MentorProfile;
  let mentorAccessToken: string;
  let category1: Category;
  let category2: Category;
  let category3: Category;
  let hashtag1: Hashtag;
  let hashtag2: Hashtag;
  let hashtag3: Hashtag;

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
    // Create a mentor
    mentor = await prisma.user.create({
      data: {
        email: 'mentorProfileEmail@test.com',
        nickname: 'mentorProfileNickname',
        profileImage: 'mentorProfileImage',
        role: 'USER',
      },
    });

    // Create a mentor profile
    mentorProfile = await prisma.mentorProfile.create({
      data: {
        userId: mentor.id,
        shortDescription: 'shortDescription',
        description: 'description',
        socialLink: '',
      },
    });

    // Create a category
    category1 = await prisma.category.create({
      data: {
        name: 'mentorProfileUpdate1',
      },
    });
    category2 = await prisma.category.create({
      data: {
        name: 'mentorProfileUpdate2',
      },
    });
    category3 = await prisma.category.create({
      data: {
        name: 'mentorProfileUpdate3',
      },
    });

    // Create a hashtag
    hashtag1 = await prisma.hashtag.create({
      data: {
        name: 'mentorProfileUpdate1',
      },
    });
    hashtag2 = await prisma.hashtag.create({
      data: {
        name: 'mentorProfileUpdate2',
      },
    });
    hashtag3 = await prisma.hashtag.create({
      data: {
        name: 'mentorProfileUpdate3',
      },
    });

    // Get mentor access token
    const response = await request(app.getHttpServer()).get(`/dev/login/${mentor.id}`);
    mentorAccessToken = response.header['location'].split('token=')[1];
  });

  afterEach(async () => {
    // Delete mentor profile
    await prisma.mentorProfile.delete({
      where: {
        id: mentorProfile.id,
      },
    });

    // Delete category
    await prisma.category.deleteMany({
      where: {
        name: {
          in: ['mentorProfileUpdate1', 'mentorProfileUpdate2', 'mentorProfileUpdate3'],
        },
      },
    });

    // Delete hashtag
    await prisma.hashtag.deleteMany({
      where: {
        name: {
          in: ['mentorProfileUpdate1', 'mentorProfileUpdate2', 'mentorProfileUpdate3'],
        },
      },
    });

    // Delete mentor
    await prisma.user.delete({
      where: {
        id: mentor.id,
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('PATCH /mentor-profiles/:id description length 0 test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      description: '',
      shortDescription: '',
      isHide: false,
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .set('Authorization', `Bearer ${mentorAccessToken}`)
      .send(mentorProfileUpdatePayload);

    expect(response.status).toEqual(200);

    const updateResult = await prisma.mentorProfile.findUnique({
      where: {
        userId: mentor.id,
      },
    });

    expect(updateResult.description).toEqual('');
    expect(updateResult.shortDescription).toEqual('');
  });

  it('PATCH /mentor_profiles/:id description undefined test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      description: undefined,
      shortDescription: undefined,
      isHide: false,
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);
    expect(response.status).toEqual(200);

    const updateResult = await prisma.mentorProfile.findUnique({
      where: {
        id: mentorProfile.id,
      },
    });

    expect(updateResult.description).toEqual(mentorProfile.description);
  });

  it('PATCH /mentor_profiles/:id description length null test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      description: null,
      shortDescription: null,
      isHide: false,
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);

    const updateResult = await prisma.mentorProfile.findUnique({
      where: {
        id: mentorProfile.id,
      },
    });
    expect(updateResult.description).toEqual(mentorProfile.description);
  });

  it('PATCH /mentor_profiles/:id no description property test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: false,
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);
    expect(response.status).toEqual(200);

    const updateResult = await prisma.mentorProfile.findUnique({
      where: {
        id: mentorProfile.id,
      },
    });
    expect(updateResult.description).toEqual(mentorProfile.description);
  });

  it('PATCH /mentor_profiles/:id description length > 0 test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      description: 'test',
      shortDescription: 'test',
      isHide: false,
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);
    expect(response.status).toEqual(200);

    const updateResult = await prisma.mentorProfile.findUnique({
      where: {
        id: mentorProfile.id,
      },
    });
    expect(updateResult.description).toEqual('test');
  });

  it('PATCH /mentor_profiles/:id isHide true, categories empty test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      categories: [],
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id isHide true, hashtags empty test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      hashtags: [],
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id isHide true, categories, hashtags empty test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      categories: [],
      hashtags: [],
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id isHide true, update categories test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      categories: [category1, category2, category3],
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id isHide true, update hashtags test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      hashtags: [hashtag1, hashtag2, hashtag3],
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id isHide true, update categories, empty hashtags test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      categories: [category1, category2, category3],
      hashtags: [],
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id isHide true, update empty categories, hashtags test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      categories: [],
      hashtags: [hashtag1, hashtag2, hashtag3],
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id socialLink invalid link failing test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      hashtags: [hashtag1, hashtag2, hashtag3],
      categories: [category1, category2, category3],
      socialLink: '42born2code.slack.com/team/U035K1WFM6H',
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id isHide true success test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      isHide: true,
      hashtags: [hashtag1, hashtag2, hashtag3],
      categories: [category1, category2, category3],
      socialLink: 'https://42born2code.slack.com/team/U035K1WFM6H',
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .send(mentorProfileUpdatePayload)
      .set('Authorization', `Bearer ${mentorAccessToken}`);

    expect(response.status).toEqual(200);
  });
});
