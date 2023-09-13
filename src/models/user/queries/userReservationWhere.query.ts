export const getUserReservationsAsMenteeWhereQuery = (id: number, status: string[]): any => {
  const whereQuery = { menteeId: id };
  whereQuery['OR'] = [];
  status.forEach((s) => {
    whereQuery['OR'].push({ status: s });
  });
  return whereQuery;
};

export const getUserReservationsAsMentorWhereQuery = (id: number, status: string[]): any => {
  const whereQuery = { mentorId: id };
  whereQuery['OR'] = [];
  status.forEach((s) => {
    whereQuery['OR'].push({ status: s });
  });
  return whereQuery;
};

export const getUserReservationsWhereQuery = <T>(id: number, status: string[]): any => {
  const whereQuery = { T: id };
  whereQuery['OR'] = [];
  status.forEach((s) => {
    whereQuery['OR'].push({ status: s });
  });
  return whereQuery;
};
