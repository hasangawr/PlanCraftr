export const minutesElapsedTillNowFrom = (date: Date) => {
  const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
  return minutes;
};
