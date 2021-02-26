export const getStartOfMonthISODate = () => {
  var date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 2).toISOString();
};
