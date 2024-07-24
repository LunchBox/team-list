import { ref, reactive, nextTick } from "vue";
import useEventListener from "@/utils/useEventListener.js";

import { offsetDate, formatDate, daysDiff } from "@/utils/dates.js";

// display 3 slots for a task that have no start_date or end_date
const DEFAULT_TASK_DAYS = 3;

export default (editMode) => {
  const dragging = ref(null);
  const draggingType = ref(null);

  // the date column that cursor on
  const hoverDate = ref(null);

  const draggingStartDate = ref(null);

  const shadow = reactive({
    start_date: null,
    end_date: null,
  });

  const draggingHandler = (item = null, type = null) => {
    if (!editMode.value) return;

    dragging.value = item;
    draggingType.value = type;

    // assign default dates
    if (!item.start_date) {
      item.start_date = formatDate(new Date());
      item.end_date = formatDate(offsetDate(new Date(), DEFAULT_TASK_DAYS - 1));
    } else if (!item.end_date) {
      item.end_date = formatDate(
        offsetDate(item.start_date, DEFAULT_TASK_DAYS - 1)
      );
    }

    const { start_date, end_date } = item;
    shadow.start_date = start_date;
    shadow.end_date = end_date;

    // 開始 dragging 的實際日期
    draggingStartDate.value = hoverDate.value;
  };

  useEventListener(document, "mousemove", (e) => {
    if (!editMode.value) return;

    if (!dragging.value || !draggingType.value) return;

    const item = dragging.value;

    if (draggingType.value === "entire") {
      const diffs = daysDiff(hoverDate.value, draggingStartDate.value);

      shadow.start_date = formatDate(offsetDate(item.start_date, diffs));
      shadow.end_date = formatDate(offsetDate(item.end_date, diffs));
    }

    const datekey = `${draggingType.value}_date`;
    if (shadow[datekey]) {
      shadow[datekey] = formatDate(hoverDate.value);
    } else {
      shadow[datekey] = formatDate(new Date());
    }
  });

  useEventListener(document, "mouseup", () => {
    if (!editMode.value) return;

    if (dragging.value && draggingType.value) {
      const item = dragging.value;
      item.start_date = shadow.start_date;
      item.end_date = shadow.end_date;
    }

    dragging.value = null;
    draggingType.value = null;

    draggingStartDate.value = null;
  });

  return { dragging, shadow, hoverDate, draggingHandler };
};
