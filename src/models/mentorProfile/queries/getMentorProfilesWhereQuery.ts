import { SelectAllType } from '../../../common/constants/selectAll.type';

export function getMentorProfilesWhereQuery(
  isHide: boolean | SelectAllType,
  hashtagId?: number | SelectAllType,
  categoryId?: number | SelectAllType,
) {
  const whereObject = {};
  if (isHide !== SelectAllType.ALL) {
    whereObject['isHide'] = isHide;
  }
  if (hashtagId !== SelectAllType.ALL) {
    whereObject['hashtags'] = {
      some: {
        id: hashtagId,
      },
    };
  }
  if (categoryId !== SelectAllType.ALL) {
    whereObject['categories'] = {
      some: {
        id: categoryId,
      },
    };
  }

  return whereObject;
}

export function getMentorProfilesSearchWhereQuery(
  searchHashtag: boolean,
  searchNickname: boolean,
  search: string,
) {
  const orArray = [];
  const whereObject = { isHide: false, OR: orArray };
  if (searchHashtag) {
    const hashtagWhereObject = {};
    hashtagWhereObject['hashtags'] = {
      some: {
        name: {
          contains: search,
        },
      },
    };
    orArray.push(hashtagWhereObject);
  }
  if (searchNickname) {
    const userWhereObject = {};
    userWhereObject['user'] = {
      nickname: {
        contains: search,
      },
    };
    orArray.push(userWhereObject);
  }
  return whereObject;
}
