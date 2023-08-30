import { SelectAllType } from '../../../common/constants/selectAll.type';

export function getReservationsWhereQuery(
  hashtagId: number | SelectAllType,
  categoryId: number | SelectAllType,
) {
  const whereObject = {};
  if (hashtagId !== SelectAllType.ALL) {
    whereObject['hashtags'] = {
      some: {
        id: hashtagId,
      },
    };
  }
  if (categoryId !== SelectAllType.ALL) {
    whereObject['categoryId'] = categoryId;
  }
  return whereObject;
}
