import { Reservation, User } from '@prisma/client';
import { baseMailTemplate } from '../baseMail.template';

/**
 * NOTE: 내부 내용은 추후에 정립할 예정입니다.
 * @description 멘토링이 취소되었음을 알리는 메일 템플릿
 * @param mentee
 * @param mentor
 */
export const getCancelTemplate = (mentee: User, mentor: User, reservation: Reservation) => {
  return baseMailTemplate(
    '[42 Manito] 멘토링이 취소되었습니다.',
    '멘토링 취소',
    `
      <p> 멘토링 요청이 취소되었습니다.</p>
      <h3>멘토링 정보</h3>
      <p>
        멘토 : ${mentor.nickname}<br>
        멘티 : ${mentee.nickname}<br>
        요청 메시지 : ${reservation.requestMessage}<br>
      </p>
    `,
    reservation.id,
  );
};
