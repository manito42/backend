import { ReservationGetResponseDto } from 'src/models/reservation/dto/response/reservationGetResponse.dto';
import { UserGetResponseDto } from 'src/models/user/dto/response/userGetResponse.dto';
import { baseMailTemplate } from '../baseMail.template';

/**
 * NOTE: 내부 내용은 추후에 정립할 예정입니다.
 * @description 멘토링이 취소되었음을 알리는 메일 템플릿
 * @param mentee
 * @param mentor
 */
export const getCancelTemplate = (
  mentee: UserGetResponseDto,
  mentor: UserGetResponseDto,
  reservation: ReservationGetResponseDto,
) => {
  return baseMailTemplate(
    '[42 Manito] 멘토링이 취소되었습니다.',
    '멘토링 취소',
    `
      <p> 멘토링 요청이 취소되었습니다.</p>
      <h3>멘토링 정보</h3>
      <p>
        멘토 : ${mentor.nickname}<br>
        멘티 : ${mentee.nickname}<br>
        취소 사유 : ${reservation.cancelReason.content}<br>
      </p>
    `,
    reservation.id,
  );
};
