export function getReservationsWhereQuery(
  hashtagId: number,
  categoryId: number,
) {
  const whereObject = {};
  if (hashtagId !== undefined) {
    whereObject['hashtags'] = {
      some: {
        id: hashtagId,
      },
    };
  }
  if (categoryId !== undefined) {
    whereObject['categoryId'] = categoryId;
  }
  return whereObject;
}
