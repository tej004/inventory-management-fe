export function getDefaultDates() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return {
    startDate: first.toISOString().slice(0, 10),
    endDate: tomorrow.toISOString().slice(0, 10),
  };
}
