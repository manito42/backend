import { Reservation } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { MenteeFeedbackResponseDto } from '../../models/menteeFeedback/dto/response/menteeFeedbackResponse.dto';
import { IMenteeFeedbackResponse } from '../../common/interfaces/api/menteeFeedback/menteeFeedbackResponse.interface';

export class MenteeFeedbackFactory {
  constructor() {}

  static getMenteeFeedback(): IMenteeFeedbackResponse {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      menteeId: faker.number.int({ min: 1, max: 1000 }),
      mentorId: faker.number.int({ min: 1, max: 1000 }),
      reservationId: faker.number.int({ min: 1, max: 1000 }),
      rating: faker.number.float({ min: 0, max: 5, precision: 0.5 }),
      content: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.future(),
    };
  }

  static getMenteeFeedbacks(count: number): Array<IMenteeFeedbackResponse> {
    const menteeFeedbacks = [];
    for (let i = 0; i < count; i++) {
      menteeFeedbacks.push(MenteeFeedbackFactory.getMenteeFeedback());
    }
    return menteeFeedbacks;
  }

  static getCreateMenteeFeedback(reservation: Reservation) {
    return {
      menteeId: reservation.menteeId,
      mentorId: reservation.mentorId,
      reservationId: reservation.id,
      rating: faker.number.float({ min: 0, max: 5, precision: 0.5 }),
      content: faker.lorem.paragraph(),
    };
  }

  static getCreateMenteeFeedbacks(reservations: Array<Reservation>) {
    const menteeFeedbacks = [];
    for (const reservation of reservations) {
      menteeFeedbacks.push(MenteeFeedbackFactory.getCreateMenteeFeedback(reservation));
    }
    return menteeFeedbacks;
  }
}
