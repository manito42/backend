import { PrismaService } from '../../database/services/prisma.service';
import { HashtagService } from './hashtag.service';
import { HashtagGetSelectQuery } from './queries/hashtagGetSelect.query';
import { HashtagFactory } from '../../database/factories/hashtag.factory';

describe('HashtagService', () => {
  let hashtagService: HashtagService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect(); // Connect to the MySQL database.
    hashtagService = new HashtagService(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('findMany', () => {
    it('test normal case [return array of hashtags]', async () => {
      const result = await prismaService.hashtag.findMany({
        select: HashtagGetSelectQuery,
        take: 20,
      });
      expect(await hashtagService.findMany({ take: 20, page: 0 })).toStrictEqual(result);
    });

    it('test queries: take, page [return array of hashtags]', async () => {
      expect(await hashtagService.findMany({ take: 5, page: 0 })).toHaveLength(5);
      expect(await hashtagService.findMany({ take: 5, page: 1 })).toHaveLength(5);
      expect(await hashtagService.findMany({ take: 100, page: 5 })).toHaveLength(0);
    });

    it('test queries: profile_id [return array of hashtags]', async () => {
      const mentorProfile = await prismaService.mentorProfile.findFirst({
        where: { id: 1 },
        include: { hashtags: true },
      });
      const mentorProfileId = mentorProfile?.id;
      expect(await hashtagService.findMany({ take: 20, page: 0, profile_id: -1 })).toHaveLength(0);
      expect(
        await hashtagService.findMany({ take: 20, page: 0, profile_id: mentorProfileId }),
      ).toStrictEqual(
        await prismaService.hashtag.findMany({
          take: 20,
          where: { profiles: { some: { id: mentorProfileId } } },
          select: HashtagGetSelectQuery,
        }),
      );
    });

    it('test queries: reservation_id [return array of hashtags]', async () => {
      const reservation = await prismaService.reservation.findFirst({ where: { id: 1 } });
      const reservationId = reservation?.id;
      expect(await hashtagService.findMany({ take: 20, page: 0, reservation_id: -1 })).toHaveLength(
        0,
      );
      expect(
        await hashtagService.findMany({ take: 20, page: 0, reservation_id: reservationId }),
      ).toStrictEqual(
        await prismaService.hashtag.findMany({
          take: 20,
          where: { reservations: { some: { id: reservationId } } },
          select: HashtagGetSelectQuery,
        }),
      );
    });

    it('test queries: search [return array of hashtags]', async () => {
      const hashtag = await prismaService.hashtag.findFirst();
      const search = hashtag?.name.substring(1, 3);
      // check not Found case
      expect(
        await hashtagService.findMany({ take: 20, page: 0, search: 'searchNotFound' }),
      ).toHaveLength(0);
      // check Found case
      const result = await hashtagService.findMany({ take: 20, page: 0, search: search });
      expect(result).toStrictEqual(
        await prismaService.hashtag.findMany({
          take: 20,
          where: { name: { contains: search } },
          select: HashtagGetSelectQuery,
        }),
      );
      // check if the result contains the search word
      result.forEach((hashtag) => {
        expect(hashtag.name).toContain(search);
      });
    });

    it('test queries: search, profile_id, reservation_id [return array of hashtags]', async () => {
      const reservation = await prismaService.reservation.findFirst({ where: { id: 1 } });
      const reservationId = reservation?.id;
      const mentorProfile = await prismaService.mentorProfile.findFirst({ where: { id: 1 } });
      const mentorProfileId = mentorProfile?.id;
      const hashtag = await prismaService.hashtag.findFirst();
      const search = hashtag?.name;

      expect(
        await hashtagService.findMany({
          take: 20,
          page: 0,
          search: 'its not exists',
          profile_id: -1,
          reservation_id: reservationId,
        }),
      ).toHaveLength(0);
      expect(
        await hashtagService.findMany({
          take: 20,
          page: 0,
          search: 'its not exists',
          profile_id: mentorProfileId,
          reservation_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await hashtagService.findMany({
          take: 20,
          page: 0,
          search: 'its not exists',
          profile_id: -1,
          reservation_id: reservationId,
        }),
      ).toHaveLength(0);
      expect(
        await hashtagService.findMany({
          take: 20,
          page: 0,
          search: search,
          profile_id: -1,
          reservation_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await hashtagService.findMany({
          take: 20,
          page: 0,
          search: search,
          profile_id: mentorProfileId,
          reservation_id: reservationId,
        }),
      ).toStrictEqual(
        await prismaService.hashtag.findMany({
          take: 20,
          where: {
            name: { contains: search },
            profiles: { some: { id: mentorProfileId } },
            reservations: { some: { id: reservationId } },
          },
          select: HashtagGetSelectQuery,
        }),
      );
    });
  });

  describe('findById', () => {
    it('test normal case [return hashtag]', async () => {
      const result = await prismaService.hashtag.findUnique({
        where: { id: 1 },
        select: HashtagGetSelectQuery,
      });
      expect(await hashtagService.findById(1)).toStrictEqual(result);
    });

    it('test not exist id [return null]', async () => {
      expect(await hashtagService.findById(-1)).toBeNull();
    });
  });

  describe('create', () => {
    it('test normal case [return hashtag]', async () => {
      const hashtag = HashtagFactory.getCreateHashTag();
      hashtag.name = 'NotExistHashTag';
      const result = await hashtagService.create(hashtag);
      expect(result).toHaveProperty('id');
      expect(result.name).toStrictEqual(hashtag.name);
    });
    it('test duplicate name [throw error]', async () => {
      const existHashTag = await prismaService.hashtag.findFirst();
      try {
        await hashtagService.create({ name: existHashTag?.name });
        expect(true).toBe(false);
      } catch (e) {
        expect(e.code).toBe('P2002');
      }
    });
  });
});
