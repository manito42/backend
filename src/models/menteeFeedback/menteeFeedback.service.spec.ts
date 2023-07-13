import { PrismaService } from '../../database/services/prisma.service';
import { ReservationFactory } from '../../database/factories/reservation.factory';
import { BadRequestException } from '@nestjs/common';
import { MenteeFeedbackService } from './menteeFeedback.service';
import { MenteeFeedbackFactory } from '../../database/factories/menteeFeedback.factory';
import { MenteeFeedbackGetSelectQuery } from './queries/menteeFeedbackGetSelect.query';

describe('MenteeFeedbackService', () => {
  let menteeFeedbackService: MenteeFeedbackService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect(); // Connect to the MySQL database.
    menteeFeedbackService = new MenteeFeedbackService(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('findMany', () => {
    it('test normal case [return array of menteeFeedbacks]', async () => {
      const result = await prismaService.menteeFeedback.findMany({
        select: MenteeFeedbackGetSelectQuery,
        take: 20,
      });
      expect(await menteeFeedbackService.findMany({ take: 20, page: 0 })).toStrictEqual(result);
    });

    it('test queries: take, page [return array of menteeFeedbacks]', async () => {
      expect(await menteeFeedbackService.findMany({ take: 5, page: 0 })).toHaveLength(5);
      expect(await menteeFeedbackService.findMany({ take: 5, page: 1 })).toHaveLength(5);
      expect(await menteeFeedbackService.findMany({ take: 1000, page: 5 })).toHaveLength(0);
    });

    it('test queries: mentee_id [return array of menteeFeedbacks]', async () => {
      const mentee = await prismaService.user.findFirst({ where: { id: 1 } });
      const menteeId = mentee?.id;
      expect(
        await menteeFeedbackService.findMany({ take: 20, page: 0, mentee_id: -1 }),
      ).toHaveLength(0);
      expect(
        await menteeFeedbackService.findMany({ take: 20, page: 0, mentee_id: menteeId }),
      ).toStrictEqual(
        await prismaService.menteeFeedback.findMany({
          take: 20,
          where: { menteeId: menteeId },
          select: MenteeFeedbackGetSelectQuery,
        }),
      );
    });

    it('test queries: mentor_id [return array of menteeFeedbacks]', async () => {
      const mentor = await prismaService.mentorProfile.findFirst({ where: { id: 1 } });
      const mentorId = mentor?.userId;
      expect(
        await menteeFeedbackService.findMany({ take: 20, page: 0, mentor_id: -1 }),
      ).toHaveLength(0);
      expect(
        await menteeFeedbackService.findMany({ take: 20, page: 0, mentor_id: mentorId }),
      ).toStrictEqual(
        await prismaService.menteeFeedback.findMany({
          take: 20,
          where: { mentorId: mentorId },
          select: MenteeFeedbackGetSelectQuery,
        }),
      );
    });

    it('test queries: reservation_id [return array of menteeFeedbacks]', async () => {
      const reservation = await prismaService.reservation.findFirst({ where: { id: 1 } });
      const reservationId = reservation?.id;
      expect(
        await menteeFeedbackService.findMany({ take: 20, page: 0, reservation_id: -1 }),
      ).toHaveLength(0);
      expect(
        await menteeFeedbackService.findMany({ take: 20, page: 0, reservation_id: reservationId }),
      ).toStrictEqual(
        await prismaService.menteeFeedback.findMany({
          take: 20,
          where: { reservationId: reservationId },
          select: MenteeFeedbackGetSelectQuery,
        }),
      );
    });

    it('test queries: mentee_id, mentor_id, reservation_id [return array of menteeFeedbacks]', async () => {
      const reservation = await prismaService.reservation.findFirst({ where: { id: 1 } });
      const reservationId = reservation?.id;
      const mentorId = reservation?.mentorId;
      const menteeId = reservation?.menteeId;

      expect(
        await menteeFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: -1,
          mentee_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await menteeFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: mentorId,
          mentee_id: -1,
          reservation_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await menteeFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: -1,
          mentee_id: menteeId,
          reservation_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await menteeFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: -1,
          mentee_id: -1,
          reservation_id: reservationId,
        }),
      ).toHaveLength(0);
      expect(
        await menteeFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: mentorId,
          mentee_id: menteeId,
          reservation_id: reservationId,
        }),
      ).toStrictEqual(
        await prismaService.menteeFeedback.findMany({
          take: 20,
          where: { mentorId: mentorId, menteeId: menteeId, reservationId: reservationId },
          select: MenteeFeedbackGetSelectQuery,
        }),
      );
    });
  });

  describe('findById', () => {
    it('test normal case [return menteeFeedback]', async () => {
      const result = await prismaService.menteeFeedback.findUnique({
        where: { id: 1 },
        select: MenteeFeedbackGetSelectQuery,
      });
      expect(await menteeFeedbackService.findById(1)).toStrictEqual(result);
    });

    it('test not exist id [return null]', async () => {
      expect(await menteeFeedbackService.findById(-1)).toBeNull();
    });
  });

  describe('create', () => {
    it('test normal case [return menteeFeedback]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: true },
      });
      const mentee = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const reservation = await prismaService.reservation.create({
        data: ReservationFactory.getCreateReservation(mentor?.id, mentee?.id),
      });
      const menteeFeedback = MenteeFeedbackFactory.getCreateMenteeFeedback(reservation);
      const ans = await prismaService.menteeFeedback.create({
        data: menteeFeedback,
        select: MenteeFeedbackGetSelectQuery,
      });
      await prismaService.menteeFeedback.delete({ where: { id: ans.id } });
      const result = await menteeFeedbackService.create(menteeFeedback);
      ans.id = result.id;
      ans.createdAt = result.createdAt;
      ans.updatedAt = result.updatedAt;
      expect(result).toStrictEqual(ans);
    });

    it('test not exist reservation ID [throw BadRequestException error]', async () => {
      const reservation = await prismaService.reservation.findFirst();
      reservation.id = -1; // not exist reservation
      const menteeFeedback = MenteeFeedbackFactory.getCreateMenteeFeedback(reservation);
      try {
        await menteeFeedbackService.create(menteeFeedback);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
    it('test reservation and mentor is not matched [throw BadRequestException]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: true },
      });
      const mentee = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const reservation = await prismaService.reservation.create({
        data: ReservationFactory.getCreateReservation(mentor?.id, mentee?.id),
      });
      const menteeFeedback = MenteeFeedbackFactory.getCreateMenteeFeedback(reservation);
      menteeFeedback.mentorId += 1;
      try {
        await menteeFeedbackService.create(menteeFeedback);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('test reservation and mentee is not matched [throw BadRequestException]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: true },
      });
      const mentee = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const reservation = await prismaService.reservation.create({
        data: ReservationFactory.getCreateReservation(mentor?.id, mentee?.id),
      });
      const menteeFeedback = MenteeFeedbackFactory.getCreateMenteeFeedback(reservation);
      menteeFeedback.menteeId += 1;
      try {
        await menteeFeedbackService.create(menteeFeedback);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
