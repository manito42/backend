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
  mentorFeedback: {
    select: {
      id: true,
      mentorId: true,
      menteeId: true,
      reservationId: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  menteeFeedback: {
    select: {
      id: true,
      mentorId: true,
      menteeId: true,
      reservationId: true,
      content: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};
