import { baseMailTemplate } from '../baseMail.template';
import { UserGetResponseDto } from 'src/models/user/dto/response/userGetResponse.dto';
import { ReservationGetResponseDto } from 'src/models/reservation/dto/response/reservationGetResponse.dto';

/**
 * NOTE: 내부 내용은 추후에 정립할 예정입니다.
 * @description 멘티에게 멘토링 성립을 알리는 메일 템플릿
 * @param mentee
 * @param mentor
 * @param reservation
 */
export const getAcceptTemplate = (
  mentee: UserGetResponseDto,
  mentor: UserGetResponseDto,
  reservation: ReservationGetResponseDto,
) => {
  return baseMailTemplate(
    '[42 Manito] 멘토링이 수락되었습니다.',
    '멘토링 수락',
    `
    <p>${mentor.nickname} 님이 ${mentee.nickname} 님의 멘토링 요청을 수락하셨습니다.<br>
    ${mentor.nickname} 님과 멘토링을 시작해보세요!</p>
    <p><a href="https://profile.intra.42.fr/users/${mentor.nickname}">멘토 intra 프로필 조회하기</a></p>
    <p><a href="${mentor.mentorProfile.socialLink}">멘토에게 슬랙 DM 하기</a></p>
    `,
    reservation.id,
  );
};
