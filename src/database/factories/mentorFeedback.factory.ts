import { Reservation } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { IMentorFeedbackResponse } from '../../common/interfaces/api/mentorFeedback/mentorFeedbackResponse.interface';

export class MentorFeedbackFactory {
  constructor() {}

  static getMentorFeedback(): IMentorFeedbackResponse {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      menteeId: faker.number.int({ min: 1, max: 1000 }),
      mentorId: faker.number.int({ min: 1, max: 1000 }),
      reservationId: faker.number.int({ min: 1, max: 1000 }),
      rating: faker.number.float({ min: 0, max: 5, precision: 0.5 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.future(),
    };
  }

  static getMentorFeedbacks(count: number): Array<IMentorFeedbackResponse> {
    const mentorFeedbacks = [];
    for (let i = 0; i < count; i++) {
      mentorFeedbacks.push(MentorFeedbackFactory.getMentorFeedback());
    }
    return mentorFeedbacks;
  }

  static getCreateMentorFeedback(reservation: Reservation) {
    return {
      menteeId: reservation.menteeId,
      mentorId: reservation.mentorId,
      reservationId: reservation.id,
      rating: faker.number.float({ min: 0, max: 5, precision: 0.5 }),
    };
  }

  static getCreateMentorFeedbacks(reservations: Array<Reservation>) {
    const mentorFeedbacks = [];
    for (const reservation of reservations) {
      mentorFeedbacks.push(MentorFeedbackFactory.getCreateMentorFeedback(reservation));
    }
    return mentorFeedbacks;
  }
}
