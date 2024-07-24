import { ref } from "vue";
import { offsetDate, daysDiff, formatDate } from "@/utils/dates.js";
import bus from "@/views/gantt/eventBus.js";

export default () => {
  const draggingItem = ref(null);

  bus.$on("item-dragstart", ([e, item] = {}) => {
    draggingItem.value = item;
  });

  const onDropToDate = (date) => {
    if (!draggingItem.value) return;

    const item = draggingItem.value;
    const { start_date, end_date } = item;

    if (start_date && end_date) {
      const diff = daysDiff(date, start_date);
      item.start_date = formatDate(offsetDate(start_date, diff));
      item.end_date = formatDate(offsetDate(end_date, diff));
    } else {
      item.start_date = formatDate(date);
      item.end_date = formatDate(offsetDate(date, 3));
    }

    draggingItem.value = null;
  };

  return {
    onDropToDate,
  };
};
