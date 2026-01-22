export function getDateRange(timeRange: string) {
  const referenceDate = new Date();
  referenceDate.setDate(referenceDate.getDate() + 1); // Set to tomorrow
  let daysToSubtract = 90;
  if (timeRange === '30d') {
    daysToSubtract = 30;
  } else if (timeRange === '7d') {
    daysToSubtract = 7;
  }
  const endDate = referenceDate;
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);
  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
}
