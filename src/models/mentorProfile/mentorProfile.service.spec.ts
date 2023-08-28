import { PrismaService } from '../../database/services/prisma.service';
import { MentorProfileService } from './mentorProfile.service';
import { MentorProfileSelectQuery } from './queries/mentorProfileSelect.query';
import { MentorProfileFactory } from '../../database/factories/mentorProfile.factory';
import { BadRequestException } from '@nestjs/common';

describe('MentorProfileService', () => {
  let mentorProfileService: MentorProfileService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect(); // Connect to the MySQL database.
    mentorProfileService = new MentorProfileService(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('findMany', () => {
    it('test normal case [return array of profiles]', async () => {
      const result = await prismaService.mentorProfile.findMany({
        select: MentorProfileSelectQuery,
        take: 3,
      });
      expect(await mentorProfileService.findMany({ take: 3, page: 0 })).toStrictEqual(result);
    });

    it('test queries: take, page [return array of profiles]', async () => {
      const numberOfMentors = await prismaService.mentorProfile.count();
      expect(await mentorProfileService.findMany({ take: 100, page: 0 })).toHaveLength(
        numberOfMentors,
      );
      expect(await mentorProfileService.findMany({ take: numberOfMentors, page: 0 })).toHaveLength(
        numberOfMentors,
      );
      expect(await mentorProfileService.findMany({ take: 1, page: 1 })).toHaveLength(1);
      expect(await mentorProfileService.findMany({ take: 5000, page: 50 })).toHaveLength(0);
    });

    it('test queries: hashtag_id [return array of profiles]', async () => {
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, hashtag_id: -1 }),
      ).toHaveLength(0);
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, hashtag_id: 0 }),
      ).toStrictEqual(
        await prismaService.mentorProfile.findMany({
          take: 20,
          where: { hashtags: { some: { id: 0 } } },
          select: MentorProfileSelectQuery,
        }),
      );
    });

    it('test queries: category_id [return array of profiles', async () => {
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, category_id: -1 }),
      ).toHaveLength(0);
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, category_id: 0 }),
      ).toStrictEqual(
        await prismaService.mentorProfile.findMany({
          take: 20,
          where: {
            categories: {
              some: { id: 0 },
            },
          },
          select: MentorProfileSelectQuery,
        }),
      );
    });

    it('test queries: mentee_id, mentor_id, reservation_id [return array of profiles]', async () => {
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, hashtag_id: -1, category_id: -1 }),
      ).toHaveLength(0);
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, hashtag_id: 1, category_id: -1 }),
      ).toHaveLength(0);
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, hashtag_id: -1, category_id: 1 }),
      ).toHaveLength(0);
      expect(
        await mentorProfileService.findMany({ take: 20, page: 0, hashtag_id: 1, category_id: 1 }),
      ).toStrictEqual(
        await prismaService.mentorProfile.findMany({
          take: 20,
          where: { categories: { some: { id: 1 } }, hashtags: { some: { id: 1 } } },
          select: MentorProfileSelectQuery,
        }),
      );
    });
  });

  describe('findById', () => {
    it('test normal case [return profile]', async () => {
      const result = await prismaService.mentorProfile.findUnique({
        where: { id: 1 },
        select: MentorProfileSelectQuery,
      });
      expect(await mentorProfileService.findById(1)).toStrictEqual(result);
    });
    it('test not exist user case [return null]', async () => {
      expect(await mentorProfileService.findById(-1)).toBeNull();
    });
  });

  describe('create', () => {
    it('test normal case [return profile]', async () => {
      const user = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const mentorProfile = MentorProfileFactory.getCreateMentorProfile(user.id);
      const ans = await prismaService.mentorProfile.create({
        data: mentorProfile,
        select: MentorProfileSelectQuery,
      });
      await prismaService.mentorProfile.delete({ where: { id: ans.id } });
      const result = await mentorProfileService.create(mentorProfile);
      ans.id = result.id;
      ans.createdAt = result.createdAt;
      ans.updatedAt = result.updatedAt;
      expect(result).toStrictEqual(ans);
    });
  });

  describe('update', () => {
    it('test normal case [return profile]', async () => {
      const mentorProfile = await prismaService.mentorProfile.findFirst();
      const hashtags = await prismaService.hashtag.findMany();
      const hashtagIds = hashtags.map((hashtag) => {
        return {
          id: hashtag.id,
        };
      });
      const categories = await prismaService.category.findMany();
      const categoryIds = categories.map((category) => {
        return {
          id: category.id,
        };
      });
      const updateReservation = MentorProfileFactory.getUpdateMentorProfile();
      updateReservation.hashtags = hashtagIds;
      updateReservation.categories = categoryIds;

      const result = await mentorProfileService.update(mentorProfile.id, updateReservation);
      expect(result.shortDescription).toBe(updateReservation.shortDescription);
      expect(result.description).toBe(updateReservation.description);
      expect(result.isHide).toBe(updateReservation.isHide);
      expect(result.categories).toStrictEqual(categories);
      expect(result.hashtags).toStrictEqual(hashtags);
    });

    it('test hashtags and categories are deleted [return profile]', async () => {
      const reservation = await prismaService.mentorProfile.findFirst();
      const updateReservation = {
        hashtags: [],
        categories: [],
      };
      const result = await mentorProfileService.update(reservation.id, updateReservation);

      expect(result.hashtags).toStrictEqual([]);
      expect(result.categories).toStrictEqual([]);
    });

    it('test not exist user case [throw P2025]', async () => {
      try {
        const result = await mentorProfileService.update(-1, {});
        expect(result).toBe({});
      } catch (e) {
        expect(e.code).toBe('P2025');
      }
    });
  });

  describe('findBySearch', () => {
    it('test search by hashtag [return array of profiles]', async () => {
      const search = 'e'; // 영어에서 가장 흔한 글자
      const result = await mentorProfileService.findBySearch(
        { take: 20, page: 0, search_by_hashtag_name: true, search_by_user_nickname: false },
        search,
      );
      expect(result).toStrictEqual(
        await prismaService.mentorProfile.findMany({
          take: 20,
          where: { OR: [{ hashtags: { some: { name: { contains: search } } } }] },
          select: MentorProfileSelectQuery,
        }),
      );
      // result element profile's hashtags name contains search
      result.forEach((profile) => {
        expect(
          profile.hashtags.some((hashtag) => hashtag.name.toLowerCase().includes(search)),
        ).toBe(true);
      });
    });
    it('test search by nickname [return array of profiles]', async () => {
      const search = 'e'; // 영어에서 가장 흔한 글자
      const result = await mentorProfileService.findBySearch(
        { take: 20, page: 0, search_by_hashtag_name: false, search_by_user_nickname: true },
        search,
      );
      expect(result).toStrictEqual(
        await prismaService.mentorProfile.findMany({
          take: 20,
          where: { OR: [{ user: { nickname: { contains: search } } }] },
          select: MentorProfileSelectQuery,
        }),
      );
      // result element profile's user nickname  contains search
      result.forEach((profile) => {
        expect(profile.user.nickname.toLowerCase().includes(search)).toBe(true);
      });
    });
    it('test nickname and hashtag both are false [throw BadRequestError]', async () => {
      try {
        await mentorProfileService.findBySearch(
          { take: 20, page: 0, search_by_hashtag_name: false, search_by_user_nickname: false },
          'something',
        );
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
    it('test search by nickname and hashtag (default) [return array of profiles]', async () => {
      const search = 'e'; // 영어에서 가장 흔한 글자
      const result = await mentorProfileService.findBySearch(
        { take: 20, page: 0, search_by_hashtag_name: true, search_by_user_nickname: true },
        search,
      );
      expect(result).toStrictEqual(
        await prismaService.mentorProfile.findMany({
          take: 20,
          where: {
            OR: [
              { user: { nickname: { contains: search } } },
              { hashtags: { some: { name: { contains: search } } } },
            ],
          },
          select: MentorProfileSelectQuery,
        }),
      );
      // result element profile's user nickname or hashtags name contains search
      result.forEach((profile) => {
        expect(
          profile.hashtags.some((hashtag) => hashtag.name.toLowerCase().includes(search)) ||
            profile.user.nickname.toLowerCase().includes(search),
        ).toBe(true);
      });
    });
  });
});
