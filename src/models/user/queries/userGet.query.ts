export const UserGetIncludes = {
  mentorProfile: {
    include: {
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
  id: true,
  nickname: true,
  profileImages: true,
  isMentor: true,
};
