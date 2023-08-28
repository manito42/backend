import { ReservationController } from './reservation.controller';
import { PrismaService } from '../../database/services/prisma.service';
import { ReservationService } from './reservation.service';
import { ReservationFactory } from '../../database/factories/reservation.factory';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservationController', () => {
  let reservationController: ReservationController;
  let reservationService: ReservationService;

  beforeEach(() => {
    reservationService = new ReservationService(new PrismaService());
    reservationController = new ReservationController(reservationService);
  });

  describe('create', () => {
    it('test normal case [return a reservation]', async () => {
      const result = ReservationFactory.getReservation();
      jest.spyOn(reservationService, 'create').mockImplementation(async () => result);
      expect(
        await reservationController.create(
          ReservationFactory.getCreateReservation(result.mentorId, result.menteeId),
        ),
      ).toBe(result);
    });
  });

  describe('update', () => {
    it('test normal case [return a reservation]', async () => {
      const result = ReservationFactory.getReservation();
      jest.spyOn(reservationService, 'update').mockImplementation(async () => result);
      expect(
        await reservationController.update(result.id, ReservationFactory.getUpdateReservation()),
      ).toBe(result);
    });
    it('test id < 1 [throw BadRequestException]', async () => {
      const result = ReservationFactory.getReservation();
      jest.spyOn(reservationService, 'update').mockImplementation(async () => result);
      await expect(
        reservationController.update(-1, ReservationFactory.getUpdateReservation()),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findMany', () => {
    it('test normal case [return array of reservations]', async () => {
      const result = ReservationFactory.getReservations(10);
      jest.spyOn(reservationService, 'findMany').mockImplementation(async () => result);

      expect(await reservationController.getReservations({})).toBe(result);
    });
  });

  describe('findById', () => {
    it('test normal case [return a reservation]', async () => {
      const result = ReservationFactory.getReservation();
      jest.spyOn(reservationService, 'findById').mockImplementation(async () => result);
      expect(await reservationController.getReservationById(result.id)).toBe(result);
    });
    it('test id < 1 [throw BadRequestException]', async () => {
      await expect(reservationController.getReservationById(-1)).rejects.toThrowError(
        BadRequestException,
      );
    });
    it('test not exist id [throw NotFoundException]', async () => {
      const result = ReservationFactory.getReservation();
      jest.spyOn(reservationService, 'findById').mockImplementation(async () => null);
      await expect(reservationController.getReservationById(result.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
