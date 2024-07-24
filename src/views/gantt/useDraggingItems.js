import { ref, reactive } from "vue";
import useEventListener from "@/utils/useEventListener.js";

import { offsetDate, formatDate } from "@/utils/dates.js";

// display 3 slots for a task that have no start_date or end_date
const DEFAULT_TASK_DAYS = 3;

const CELL_WIDTH = 30;

export default () => {
  const dragging = ref(null);
  const draggingType = ref(null);
  const draggingDist = ref(0);

  const shadow = reactive({
    start_date: null,
    end_date: null,
  });

  const draggingHandler = (item = null, type = null) => {
    dragging.value = item;
    draggingType.value = type;
    draggingDist.value = 0;

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
  };

  useEventListener(document, "mousemove", (e) => {
    if (!dragging.value || !draggingType.value) return;
    draggingDist.value += e.movementX;

    const item = dragging.value;
    const moved = Math.round(draggingDist.value / CELL_WIDTH);

    if (draggingType.value === "entire") {
      shadow.start_date = formatDate(offsetDate(item.start_date, moved));
      shadow.end_date = formatDate(offsetDate(item.end_date, moved));
    }

    const datekey = `${draggingType.value}_date`;
    if (shadow[datekey]) {
      shadow[datekey] = formatDate(offsetDate(item[datekey], moved));
    } else {
      shadow[datekey] = formatDate(new Date());
    }
  });

  useEventListener(document, "mouseup", () => {
    const threshold = Math.abs(draggingDist.value) > CELL_WIDTH / 2;

    if (dragging.value && draggingType.value && threshold) {
      const item = dragging.value;
      item.start_date = shadow.start_date;
      item.end_date = shadow.end_date;
    }

    dragging.value = null;
    draggingType.value = null;
    draggingDist.value = 0;
  });

  return { dragging, shadow, draggingHandler };
};
