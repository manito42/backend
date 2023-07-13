export function getMenteeFeedbacksWhereQuery(
  mentorId: number,
  menteeId: number,
  reservationId: number,
) {
  const whereObject = {};
  if (mentorId !== undefined) {
    whereObject['mentorId'] = mentorId;
  }
  if (menteeId !== undefined) {
    whereObject['menteeId'] = menteeId;
  }
  if (reservationId !== undefined) {
    whereObject['reservationId'] = reservationId;
  }
  return whereObject;
}
