import { daysDiff } from "@/utils/dates.js";

export const dateToGridColumn = (date, start_date) => {
  const d = new Date(date);

  let offset = Math.floor(daysDiff(d, start_date));
  return Math.max(offset, 1) + 1;
};
