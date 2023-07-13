import { PrismaService } from '../../database/services/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MentorFeedbackController } from './mentorFeedback.controller';
import { MentorFeedbackService } from './mentorFeedback.service';
import { MentorFeedbackFactory } from '../../database/factories/mentorFeedback.factory';
import { ReservationFactory } from '../../database/factories/reservation.factory';

describe('MentorFeedbackController', () => {
  let mentorFeedbackController: MentorFeedbackController;
  let mentorFeedbackService: MentorFeedbackService;

  beforeEach(() => {
    mentorFeedbackService = new MentorFeedbackService(new PrismaService());
    mentorFeedbackController = new MentorFeedbackController(mentorFeedbackService);
  });

  describe('create', () => {
    it('test normal case [return a mentorFeedback]', async () => {
      const reservation = ReservationFactory.getReservation();
      const result = MentorFeedbackFactory.getMentorFeedback();
      jest.spyOn(mentorFeedbackService, 'create').mockImplementation(async () => result);
      expect(
        await mentorFeedbackController.create(
          MentorFeedbackFactory.getCreateMentorFeedback(reservation),
        ),
      ).toBe(result);
    });
  });

  describe('findMany', () => {
    it('test normal case [return array of mentorFeedback]', async () => {
      const result = MentorFeedbackFactory.getMentorFeedbacks(10);
      jest.spyOn(mentorFeedbackService, 'findMany').mockImplementation(async () => result);
      expect(await mentorFeedbackController.getMentorFeedbacks({ take: 10, page: 0 })).toBe(result);
    });
  });

  describe('findById', () => {
    it('test normal case [return a mentorFeedback]', async () => {
      const result = MentorFeedbackFactory.getMentorFeedback();
      jest.spyOn(mentorFeedbackService, 'findById').mockImplementation(async () => result);
      expect(await mentorFeedbackController.getMentorFeedbackById(result.id)).toBe(result);
    });
    it('test id < 1 [throw BadRequestException]', async () => {
      const result = MentorFeedbackFactory.getMentorFeedback();
      jest.spyOn(mentorFeedbackService, 'findById').mockImplementation(async () => result);
      await expect(mentorFeedbackController.getMentorFeedbackById(-1)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('test not exist id [throw NotFoundException]', async () => {
      const result = MentorFeedbackFactory.getMentorFeedback();
      jest.spyOn(mentorFeedbackService, 'findById').mockImplementation(async () => null);
      await expect(mentorFeedbackController.getMentorFeedbackById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
