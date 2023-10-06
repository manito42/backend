import { baseMailTemplate } from '../baseMail.template';
import { UserGetResponseDto } from 'src/models/user/dto/response/userGetResponse.dto';
import { ReservationGetResponseDto } from 'src/models/reservation/dto/response/reservationGetResponse.dto';

/**
 * NOTE: 내부 내용은 추후에 정립할 예정입니다.
 * @description 멘토링 종료 후 멘토에게 멘토링 완료를 알리는 메일 템플릿
 * @param mentee
 * @param mentor
 * @param reservation
 */
export const getMenteeCompletionTemplate = (
  mentee: UserGetResponseDto,
  mentor: UserGetResponseDto,
  reservation: ReservationGetResponseDto,
) => {
  return baseMailTemplate(
    '[42 Manito] 멘토링 종료 알림',
    '멘토링 종료',
    `
    <p>${mentee.nickname} 님과의 멘토링이 종료되었습니다. 멘토링을 평가하고 종료해주세요.<br></p>
    `,
    reservation.id,
  );
};
