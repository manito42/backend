import { PrismaService } from '../../database/services/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationFactory } from '../../database/factories/reservation.factory';
import { MenteeFeedbackController } from './menteeFeedback.controller';
import { MenteeFeedbackService } from './menteeFeedback.service';
import { MenteeFeedbackFactory } from '../../database/factories/menteeFeedback.factory';

describe('MenteeFeedbackController', () => {
  let menteeFeedbackController: MenteeFeedbackController;
  let menteeFeedbackService: MenteeFeedbackService;

  beforeEach(() => {
    menteeFeedbackService = new MenteeFeedbackService(new PrismaService());
    menteeFeedbackController = new MenteeFeedbackController(menteeFeedbackService);
  });

  describe('create', () => {
    it('test normal case [return a menteeFeedback]', async () => {
      const reservation = ReservationFactory.getReservation();
      const result = MenteeFeedbackFactory.getMenteeFeedback();
      jest.spyOn(menteeFeedbackService, 'create').mockImplementation(async () => result);
      expect(
        await menteeFeedbackController.create(
          MenteeFeedbackFactory.getCreateMenteeFeedback(reservation),
        ),
      ).toBe(result);
    });
  });

  describe('findMany', () => {
    it('test normal case [return array of menteeFeedback]', async () => {
      const result = MenteeFeedbackFactory.getMenteeFeedbacks(10);
      jest.spyOn(menteeFeedbackService, 'findMany').mockImplementation(async () => result);
      expect(await menteeFeedbackController.getMenteeFeedbacks({ take: 10, page: 0 })).toBe(result);
    });
  });

  describe('findById', () => {
    it('test normal case [return a menteeFeedback]', async () => {
      const result = MenteeFeedbackFactory.getMenteeFeedback();
      jest.spyOn(menteeFeedbackService, 'findById').mockImplementation(async () => result);
      expect(await menteeFeedbackController.getMenteeFeedbackById(result.id)).toBe(result);
    });
    it('test id < 1 [throw BadRequestException]', async () => {
      const result = MenteeFeedbackFactory.getMenteeFeedback();
      jest.spyOn(menteeFeedbackService, 'findById').mockImplementation(async () => result);
      await expect(menteeFeedbackController.getMenteeFeedbackById(-1)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('test not exist id [throw NotFoundException]', async () => {
      jest.spyOn(menteeFeedbackService, 'findById').mockImplementation(async () => null);
      await expect(menteeFeedbackController.getMenteeFeedbackById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
