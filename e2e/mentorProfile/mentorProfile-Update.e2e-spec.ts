import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/database/services/prisma.service';
import { User, MentorProfile } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { MentorProfileUpdatePayloadDto } from '../../src/models/mentorProfile/dto/request/mentorProfileUpdatePayload.dto';
import { ValidationOptions } from '../../src/common/pipes/validationPipe/validationOptions.constant';
import { PrismaClientExceptionFilter } from '../../src/common/filters/prismaClientException.filter';

describe('PATCH /mentor-profiles description test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mentor: User;
  let mentorProfile: MentorProfile;
  let mentorAccessToken: string;

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
      },
    });

    // Get mentor access token
    const response = await request(app.getHttpServer()).get(`/dev/login/${mentor.id}`);
    mentorAccessToken = response.body.accessToken;
  });

  afterEach(async () => {
    // Delete mentor profile
    await prisma.mentorProfile.delete({
      where: {
        id: mentorProfile.id,
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
      hashtags: [],
      categories: [],
      isHide: false,
    };

    const response = await request(app.getHttpServer())
      .patch(`/mentor_profiles/${mentor.id}`)
      .set('Authorization', `Bearer ${mentorAccessToken}`)
      .send(mentorProfileUpdatePayload);

    expect(response.status).toEqual(400);
  });

  it('PATCH /mentor_profiles/:id description undefined test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      description: undefined,
      shortDescription: undefined,
      hashtags: [],
      categories: [],
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

    expect(updateResult.description).toEqual(null);
  });

  it('PATCH /mentor_profiles/:id description length null test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      description: null,
      shortDescription: null,
      hashtags: [],
      categories: [],
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
    expect(updateResult.description).toEqual(null);
  });

  it('PATCH /mentor_profiles/:id no description property test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      hashtags: [],
      categories: [],
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
    expect(updateResult.description).toEqual(null);
  });

  it('PATCH /mentor_profiles/:id description length > 0 test', async () => {
    const mentorProfileUpdatePayload: MentorProfileUpdatePayloadDto = {
      description: 'test',
      shortDescription: 'test',
      hashtags: [],
      categories: [],
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
});
