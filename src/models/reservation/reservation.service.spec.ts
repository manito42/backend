import { PrismaService } from '../../database/services/prisma.service';
import { ReservationService } from './reservation.service';
import { ReservationSelectQuery } from './queries/reservationSelect.query';
import { ReservationFactory } from '../../database/factories/reservation.factory';
import { BadRequestException } from '@nestjs/common';

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect(); // Connect to the MySQL database.
    reservationService = new ReservationService(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('findMany', () => {
    it('test normal case [return array of reservation]', async () => {
      const result = await prismaService.reservation.findMany({
        select: ReservationSelectQuery,
        take: 3,
      });
      expect(await reservationService.findMany({ take: 3, page: 0 })).toStrictEqual(result);
    });

    it('test queries: take, page [return array of reservations] ', async () => {
      expect(await reservationService.findMany({ take: 1, page: 0 })).toHaveLength(1);
      expect(await reservationService.findMany({ take: 5, page: 0 })).toHaveLength(5);
      expect(await reservationService.findMany({ take: 5, page: 1 })).toHaveLength(5);
      expect(await reservationService.findMany({ take: 5000, page: 5 })).toHaveLength(0);
    });

    it('test queries: hashtag_id [return array of reservations]', async () => {
      expect(await reservationService.findMany({ take: 20, page: 0, hashtag_id: -1 })).toHaveLength(
        0,
      );
      expect(await reservationService.findMany({ take: 20, page: 0, hashtag_id: 1 })).toStrictEqual(
        await prismaService.reservation.findMany({
          take: 20,
          where: { hashtags: { some: { id: 1 } } },
          select: ReservationSelectQuery,
        }),
      );
    });

    it('test queries: category_id [return array of reservations]', async () => {
      expect(
        await reservationService.findMany({ take: 20, page: 0, category_id: -1 }),
      ).toHaveLength(0);
      expect(
        await reservationService.findMany({ take: 20, page: 0, category_id: 1 }),
      ).toStrictEqual(
        await prismaService.reservation.findMany({
          take: 20,
          where: { categoryId: 1 },
          select: ReservationSelectQuery,
        }),
      );
    });

    it('test queries: hashtag_id, category_id [return array of reservations]', async () => {
      expect(
        await reservationService.findMany({ take: 20, page: 0, hashtag_id: -1, category_id: -1 }),
      ).toHaveLength(0);
      expect(
        await reservationService.findMany({ take: 20, page: 0, hashtag_id: 1, category_id: -1 }),
      ).toHaveLength(0);
      expect(
        await reservationService.findMany({ take: 20, page: 0, hashtag_id: -1, category_id: 1 }),
      ).toHaveLength(0);
      expect(
        await reservationService.findMany({ take: 20, page: 0, hashtag_id: 1, category_id: 1 }),
      ).toStrictEqual(
        await prismaService.reservation.findMany({
          take: 20,
          where: { categoryId: 1, hashtags: { some: { id: 1 } } },
          select: ReservationSelectQuery,
        }),
      );
    });
  });

  describe('findById', () => {
    it('test normal case [return a reservation]', async () => {
      const result = await prismaService.reservation.findUnique({
        where: { id: 1 },
        select: ReservationSelectQuery,
      });
      expect(await reservationService.findById(1)).toStrictEqual(result);
    });

    it('test not exist user id [return null]', async () => {
      expect(await reservationService.findById(-1)).toBeNull();
    });
  });

  describe('create', () => {
    it('test normal case [return a reservation]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: true },
      });
      const mentee = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const reservation = ReservationFactory.getCreateReservation(mentor.id, mentee.id);
      const ans = await prismaService.reservation.create({
        data: reservation,
        select: ReservationSelectQuery,
      });
      await prismaService.reservation.delete({ where: { id: ans.id } });
      const result = await reservationService.create(reservation);
      ans.createdAt = result.createdAt;
      ans.updatedAt = result.updatedAt;
      ans.id = result.id;
      expect(result).toStrictEqual(ans);
    });
    it('test not exist mentor id [throw BadRequestException]', async () => {
      const mentee = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const reservation = ReservationFactory.getCreateReservation(-1, mentee.id);
      try {
        await reservationService.create(reservation);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
    it('test not exist mentee id [throw P2003]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: true },
      });
      const reservation = ReservationFactory.getCreateReservation(mentor.id, -1);
      try {
        await reservationService.create(reservation);
        expect(true).toBe(false);
      } catch (e) {
        expect(e.code).toBe('P2003');
      }
    });
    it('test request mentor is not mentor [throw BadRequestException]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const mentee = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const reservation = ReservationFactory.getCreateReservation(mentor.id, mentee.id);
      try {
        await reservationService.create(reservation);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
    it('test mentee === mentor [throw BadRequestException]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: true },
      });
      const reservation = ReservationFactory.getCreateReservation(mentor.id, mentor.id);
      try {
        await reservationService.create(reservation);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('update', () => {
    it('test normal case [return a reservation]', async () => {
      const reservation = await prismaService.reservation.findFirst();
      const hashtags = await prismaService.hashtag.findMany();
      const hashtagIds = hashtags.map((hashtag) => {
        return {
          id: hashtag.id,
        };
      });
      const updateReservation = ReservationFactory.getUpdateReservation();
      updateReservation.hashtags = hashtagIds;
      const result = await reservationService.update(reservation.id, updateReservation);

      expect(result.requestMessage).toBe(updateReservation.requestMessage);
      expect(result.status).toBe(updateReservation.status);
      expect(result.categoryId).toBe(updateReservation.categoryId);
      expect(result.hashtags).toStrictEqual(hashtags);
    });

    it('test hashtags are deleted [return reservation]', async () => {
      const reservation = await prismaService.reservation.findFirst();
      const updateReservation = {
        hashtags: [],
      };
      const result = await reservationService.update(reservation.id, updateReservation);

      expect(result.hashtags).toStrictEqual([]);
    });

    it('test not exist reservation [throw P2025]', async () => {
      try {
        const result = await reservationService.update(-1, {});
        expect(result).toBe({});
      } catch (e) {
        expect(e.code).toBe('P2025');
      }
    });
  });
});
