export function getHashtagsWhereQuery(
  profileId: number,
  reservationId: number,
  search: string,
) {
  const whereObject = {};
  if (profileId !== undefined) {
    whereObject['profiles'] = {
      some: {
        id: profileId,
      },
    };
  }
  if (reservationId !== undefined) {
    whereObject['reservations'] = {
      some: {
        id: reservationId,
      },
    };
  }
  if (search !== undefined) {
    whereObject['name'] = {
      contains: search,
    };
  }
  return whereObject;
}
