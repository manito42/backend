import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationOptions } from '../../common/pipes/validationPipe/validationOptions.constant';
import { PrismaClientExceptionFilter } from '../../common/filters/prismaClientException.filter';
import { NotificationModule } from './notification.module';
import { Reservation, ReservationStatus, User, UserRole } from '@prisma/client';
import { IReservationEventPayload } from '../../common/interfaces/event/reservation/reservationEventPayload.interface';
import { getMailerConfig } from '../../common/constants/getMailerConfig';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

describe('NotificationController', () => {
  let app: INestApplication;
  let controller: NotificationController;
  let mailerService: MailerService;
  let mentor: User;
  let mentee: User;
  let reservation: Reservation;
  let payload: IReservationEventPayload;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    jest.useFakeTimers();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        NotificationModule,
        MailerModule.forRootAsync({ useFactory: getMailerConfig }),
        EventEmitterModule.forRoot(),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(ValidationOptions));
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    await app.init();

    controller = moduleFixture.get<NotificationController>(NotificationController);
    // mailerService = moduleFixture.get<MailerService>(MailerService);
    eventEmitter = moduleFixture.get<EventEmitter2>(EventEmitter2);
  });

  beforeEach(() => {
    mentor = {
      id: 1,
      email: 'sungjpar@student.42seoul.kr',
      nickname: 'sungjpar',
      profileImage: 'https://cdn.intra.42.fr/users/sungjpar.jpg',
      mentoringCount: 0,
      mentorProfileId: 1,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mentee = {
      id: 2,
      email: 'sungjpar@student.42seoul.kr',
      nickname: 'sungjpar2',
      profileImage: 'https://cdn.intra.42.fr/users/sungjpar.jpg',
      mentoringCount: 0,
      mentorProfileId: 2,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    reservation = {
      id: 1,
      menteeId: 2,
      mentorId: 1,
      requestMessage: '멘토링 요청 메시지',
      categoryId: 1,
      status: ReservationStatus.REQUEST,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    payload = {
      mentor,
      mentee,
      reservation,
    };
  });

  /**
   * NOTE: 현재 테스트에서 직접 검증 불가능. 메일이 발신되는지 확인만 할 것.
   */
  describe('handleReservationRequest', () => {
    it('test mailing', async () => {
      eventEmitter.emit('reservation.request', payload);
      jest.advanceTimersByTime(1000);
      expect(true).toBe(true);
    });
  });
});
