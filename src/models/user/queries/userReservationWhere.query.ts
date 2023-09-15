import { ReservationStatus } from '@prisma/client';
import { ReservationRole } from 'src/common/enums';

export const getUserReservationsWhereQuery = (
  id: number,
  role: ReservationRole,
  status: ReservationStatus[],
): any => {
  const whereQuery = {};
  whereQuery['OR'] = [];
  if (role === ReservationRole.MENTEE || role === ReservationRole.ALL)
    whereQuery['OR'].push({ menteeId: id });
  if (role === ReservationRole.MENTOR || role === ReservationRole.ALL)
    whereQuery['OR'].push({ mentorId: id });
  status.forEach((s) => {
    whereQuery['OR'].push({ status: s });
  });
  return whereQuery;
};
