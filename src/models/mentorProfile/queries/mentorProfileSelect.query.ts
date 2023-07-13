export const MentorProfileSelectQuery = {
  id: true,
  isHide: true,
  shortDescription: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  hashtags: {
    select: {
      id: true,
      name: true,
    },
  },
  categories: {
    select: {
      id: true,
      name: true,
    },
  },
  user: {
    select: {
      id: true,
      nickname: true,
      profileImage: true,
    },
  },
};
