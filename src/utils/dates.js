export const offsetDate = (date, offset) => {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d;
};

export const daysDiff = (d1, d2) => {
  const t = new Date(d1);
  const f = new Date(d2);
  return (t - f) / 3600 / 24 / 1000;
};

export const formatDate = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

export const humanizeDate = (date) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};
