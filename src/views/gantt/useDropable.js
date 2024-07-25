import { offsetDate, daysDiff, formatDate } from "@/utils/dates.js";

export default ({ editMode = null, selection = null } = {}) => {
  const onDropToDate = (date) => {
    if (!editMode?.value) return;

    if (!selection?.anySelected) return;

    selection.selectedItems.value.forEach((item) => {
      const { start_date, end_date } = item;

      if (start_date && end_date) {
        const diff = daysDiff(date, start_date);
        item.start_date = formatDate(offsetDate(start_date, diff));
        item.end_date = formatDate(offsetDate(end_date, diff));
      } else {
        item.start_date = formatDate(date);
        item.end_date = formatDate(offsetDate(date, 3));
      }
    });

    selection.clearSelection();
  };

  return {
    onDropToDate,
  };
};
