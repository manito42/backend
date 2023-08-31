import { SelectAllType } from '../../../common/constants/selectAll.type';

export function getMentorFeedbacksWhereQuery(
  mentorId: number | SelectAllType,
  menteeId: number | SelectAllType,
  reservationId: number | SelectAllType,
) {
  const whereObject = {};
  if (mentorId !== SelectAllType.ALL) {
    whereObject['mentorId'] = mentorId;
  }
  if (menteeId !== SelectAllType.ALL) {
    whereObject['menteeId'] = menteeId;
  }
  if (reservationId !== SelectAllType.ALL) {
    whereObject['reservationId'] = reservationId;
  }
  return whereObject;
}
