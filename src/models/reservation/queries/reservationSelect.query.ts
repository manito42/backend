import { HashtagGetSelectQuery } from '../../hashtag/queries/hashtagGetSelect.query';
import { CategoryGetSelectQuery } from '../../category/queries/categoryGetSelect.query';

export const ReservationSelectQuery = {
  id: true,
  mentorId: true,
  menteeId: true,
  category: {
    select: CategoryGetSelectQuery,
  },
  requestMessage: true,
  status: true,
  hashtags: {
    select: HashtagGetSelectQuery,
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
  cancelReason: {
    select: {
      content: true,
      createdAt: true,
      requestedUserId: true,
      reservationId: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};
