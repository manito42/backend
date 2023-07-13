export const ReservationSelectQuery = {
  id: true,
  mentorId: true,
  menteeId: true,
  categoryId: true,
  requestMessage: true,
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
