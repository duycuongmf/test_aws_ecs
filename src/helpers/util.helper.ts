export const transformQueryDate = (dateTime?) => {
  let dateFrom;
  let dateTo;
  if (dateTime) {
    dateTime = new Date(dateTime);
    dateFrom = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      0,
      0,
      0
    );
    dateTo = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      23,
      59,
      59
    );
    console.log(dateFrom);
  } else {
    dateTime = new Date();
    const thirtyDaysAgo = new Date();
    dateTo = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate() + 10,
      0,
      0,
      0
    );
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    dateFrom = new Date(
      thirtyDaysAgo.getFullYear(),
      thirtyDaysAgo.getMonth(),
      thirtyDaysAgo.getDate()
    );
  }
  return {
    dateFrom: dateFrom,
    dateTo: dateTo,
  };
};
