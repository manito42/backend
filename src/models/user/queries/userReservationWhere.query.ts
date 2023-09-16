import { ReservationStatus } from '@prisma/client';
import { ReservationRole } from 'src/common/enums';

export const getUserReservationsWhereQuery = (
  id: number,
  role: ReservationRole,
  status: ReservationStatus[],
): any => {
  const whereQuery = { status: { in: status } };

  if (role === ReservationRole.ALL) {
    whereQuery['OR'] = [{ menteeId: id }, { mentorId: id }];
  } else if (role === ReservationRole.MENTEE) {
    whereQuery['menteeId'] = id;
  } else {
    whereQuery['mentorId'] = id;
  }
  return whereQuery;
};
