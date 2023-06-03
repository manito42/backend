import { ReservationStatus, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { HashtagFactory } from './hashtag.factory';

export class ReservationFactory {
  constructor() {}
  private static readonly reservationStatus = Object.values(ReservationStatus);
  // Function to get a random enum value
  private static getRandomReservationStatus(): ReservationStatus {
    const randomIndex = Math.floor(Math.random() * this.reservationStatus.length);
    return this.reservationStatus[randomIndex];
  }

  static getReservation() {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      mentorId: faker.number.int({ min: 1, max: 1000 }),
      menteeId: faker.number.int({ min: 1, max: 1000 }),
      categoryId: faker.number.int({ min: 1, max: 1000 }),
      requestMessage: faker.lorem.sentence(),
      status: this.getRandomReservationStatus(),
      hashtags: HashtagFactory.getHashtags(3),
      createdAt: faker.date.past(),
      updatedAt: faker.date.future(),
    };
  }

  static getReservations(count: number) {
    const reservations = [];
    for (let i = 0; i < count; i++) {
      reservations.push(ReservationFactory.getReservation());
    }
    return reservations;
  }

  static getCreateReservation(mentorId: number, menteeId: number) {
    return {
      mentorId: mentorId,
      menteeId: menteeId,
      categoryId: faker.number.int({ min: 1, max: 2 }),
      requestMessage: faker.lorem.paragraph(),
    };
  }

  static getCreateReservations(count: number, users: Array<User>, mentors: Array<User>) {
    const reservations = [];
    for (let i = 0; i < count; i++) {
      reservations.push(
        ReservationFactory.getCreateReservation(
          mentors[i % mentors.length].id,
          users[i % users.length].id,
        ),
      );
    }
    return reservations;
  }

  static getUpdateReservation() {
    return {
      requestMessage: faker.lorem.paragraph(),
      status: this.getRandomReservationStatus(),
      hashtags: HashtagFactory.getHashtags(3).map((hashtag) => {
        return {
          id: hashtag.id,
        };
      }),
      categoryId: faker.number.int({ min: 1, max: 2 }),
    };
  }
}
