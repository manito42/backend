export const UserSelectQuery = {
  id: true,
  nickname: true,
  email: true,
  profileImage: true,
  isMentor: true,
  mentoringCount: true,
  ratingSum: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  mentorProfile: {
    select: {
      id: true,
      shortDescription: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      isHide: true,
      mentoringCount: true,
      ratingSum: true,
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
    },
  },
};
