export const UserReservationSelectQuery = {
  id: true,
  mentorId: true,
  menteeId: true,
  categoryId: true,
  requestMessage: false,
  status: true,
  hashtags: {
    select: {
      id: true,
      name: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};
