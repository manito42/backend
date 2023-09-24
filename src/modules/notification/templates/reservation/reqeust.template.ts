import { User } from '@prisma/client';
import { baseMailTemplate } from '../baseMail.template';
import { Reservation } from '.prisma/client';

/**
 * NOTE: 내부 내용은 추후에 정립할 예정입니다.
 * @description 멘토에게 멘토링 요청이 들어왔을 때 보내는 메일 템플릿
 * @param mentee
 * @param mentor
 * @param reservation
 * @param message
 */
export const getRequestTemplate = (
  mentee: User,
  mentor: User,
  reservation: Reservation,
  message: string,
) => {
  return baseMailTemplate(
    '[42 Manito] 멘토링 요청이 도착했습니다.',
    '멘토링 요청',
    `<p>${mentee.nickname} 님이 ${mentor.nickname} 님에게 멘토링을 요청하셨습니다.</p>
      <p><b>요청 메시지</b> : ${message}</p>
    `,
    reservation.id,
  );
};
