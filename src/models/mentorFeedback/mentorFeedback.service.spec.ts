import { PrismaService } from '../../database/services/prisma.service';
import { MentorFeedbackService } from './mentorFeedback.service';
import { MentorFeedbackSelectQuery } from './queries/mentorFeedbackSelect.query';
import { MentorFeedbackFactory } from '../../database/factories/mentorFeedback.factory';
import { ReservationFactory } from '../../database/factories/reservation.factory';
import { BadRequestException } from '@nestjs/common';

describe('MentorFeedbackService', () => {
  let mentorFeedbackService: MentorFeedbackService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    prismaService = new PrismaService();
    await prismaService.$connect(); // Connect to the MySQL database.
    mentorFeedbackService = new MentorFeedbackService(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect(); // Disconnect from the MySQL database.
  });

  describe('findMany', () => {
    it('test normal case [return array of mentorFeedbacks]', async () => {
      const result = await prismaService.mentorFeedback.findMany({
        select: MentorFeedbackSelectQuery,
        take: 20,
      });
      expect(await mentorFeedbackService.findMany({ take: 20, page: 0 })).toStrictEqual(result);
    });

    it('test queries: take, page [return array of mentorFeedbacks]', async () => {
      expect(await mentorFeedbackService.findMany({ take: 5, page: 0 })).toHaveLength(5);
      expect(await mentorFeedbackService.findMany({ take: 5, page: 1 })).toHaveLength(5);
      expect(await mentorFeedbackService.findMany({ take: 1000, page: 5 })).toHaveLength(0);
    });

    it('test queries: mentee_id [return array of mentorFeedbacks]', async () => {
      const mentee = await prismaService.user.findFirst({ where: { id: 1 } });
      const menteeId = mentee?.id;
      expect(
        await mentorFeedbackService.findMany({ take: 20, page: 0, mentee_id: -1 }),
      ).toHaveLength(0);
      expect(
        await mentorFeedbackService.findMany({ take: 20, page: 0, mentee_id: menteeId }),
      ).toStrictEqual(
        await prismaService.mentorFeedback.findMany({
          take: 20,
          where: { menteeId: menteeId },
          select: MentorFeedbackSelectQuery,
        }),
      );
    });

    it('test queries: mentor_id [return array of mentorFeedbacks]', async () => {
      const mentor = await prismaService.mentorProfile.findFirst({ where: { id: 1 } });
      const mentorId = mentor?.userId;
      expect(
        await mentorFeedbackService.findMany({ take: 20, page: 0, mentor_id: -1 }),
      ).toHaveLength(0);
      expect(
        await mentorFeedbackService.findMany({ take: 20, page: 0, mentor_id: mentorId }),
      ).toStrictEqual(
        await prismaService.mentorFeedback.findMany({
          take: 20,
          where: { mentorId: mentorId },
          select: MentorFeedbackSelectQuery,
        }),
      );
    });

    it('test queries: reservation_id [return array of mentorFeedbacks]', async () => {
      const reservation = await prismaService.reservation.findFirst({ where: { id: 1 } });
      const reservationId = reservation?.id;
      expect(
        await mentorFeedbackService.findMany({ take: 20, page: 0, reservation_id: -1 }),
      ).toHaveLength(0);
      expect(
        await mentorFeedbackService.findMany({ take: 20, page: 0, reservation_id: reservationId }),
      ).toStrictEqual(
        await prismaService.mentorFeedback.findMany({
          take: 20,
          where: { reservationId: reservationId },
          select: MentorFeedbackSelectQuery,
        }),
      );
    });

    it('test queries: hashtag_id, category_id [return array of mentorFeedbacks]', async () => {
      const reservation = await prismaService.reservation.findFirst({ where: { id: 1 } });
      const reservationId = reservation?.id;
      const mentorId = reservation?.mentorId;
      const menteeId = reservation?.menteeId;

      expect(
        await mentorFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: -1,
          mentee_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await mentorFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: mentorId,
          mentee_id: -1,
          reservation_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await mentorFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: -1,
          mentee_id: menteeId,
          reservation_id: -1,
        }),
      ).toHaveLength(0);
      expect(
        await mentorFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: -1,
          mentee_id: -1,
          reservation_id: reservationId,
        }),
      ).toHaveLength(0);
      expect(
        await mentorFeedbackService.findMany({
          take: 20,
          page: 0,
          mentor_id: mentorId,
          mentee_id: menteeId,
          reservation_id: reservationId,
        }),
      ).toStrictEqual(
        await prismaService.mentorFeedback.findMany({
          take: 20,
          where: { mentorId: mentorId, menteeId: menteeId, reservationId: reservationId },
          select: MentorFeedbackSelectQuery,
        }),
      );
    });
  });

  describe('findById', () => {
    it('test normal case [return mentorFeedback]', async () => {
      const result = await prismaService.mentorFeedback.findUnique({
        where: { id: 1 },
        select: MentorFeedbackSelectQuery,
      });
      expect(await mentorFeedbackService.findById(1)).toStrictEqual(result);
    });

    it('test not exist id [return null]', async () => {
      expect(await mentorFeedbackService.findById(-1)).toBeNull();
    });
  });

  describe('create', () => {
    it('test normal case [return mentorFeedback]', async () => {
      const mentor = await prismaService.user.findFirst({
        where: { isMentor: true },
      });
      const mentee = await prismaService.user.findFirst({
        where: { isMentor: false },
      });
      const reservation = await prismaService.reservation.create({
        data: ReservationFactory.getCreateReservation(mentor?.id, mentee?.id),
      });
      const mentorFeedback = MentorFeedbackFactory.getCreateMentorFeedback(reservation);
      const ans = await prismaService.mentorFeedback.create({
        data: mentorFeedback,
        select: MentorFeedbackSelectQuery,
      });
      await prismaService.mentorFeedback.delete({ where: { id: ans.id } });
      const result = await mentorFeedbackService.create(mentorFeedback);
      ans.id = result.id;
      ans.createdAt = result.createdAt;
      ans.updatedAt = result.updatedAt;
      expect(result).toStrictEqual(ans);
    });

    it('test not exist reservation ID [throw BadRequestException error]', async () => {
      const reservation = await prismaService.reservation.findFirst();
      reservation.id = -1; // not exist reservation
      const mentorFeedback = MentorFeedbackFactory.getCreateMentorFeedback(reservation);
      try {
        await mentorFeedbackService.create(mentorFeedback);
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
      const mentorFeedback = MentorFeedbackFactory.getCreateMentorFeedback(reservation);
      mentorFeedback.mentorId += 1;
      try {
        await mentorFeedbackService.create(mentorFeedback);
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
      const mentorFeedback = MentorFeedbackFactory.getCreateMentorFeedback(reservation);
      mentorFeedback.menteeId += 1;
      try {
        await mentorFeedbackService.create(mentorFeedback);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
