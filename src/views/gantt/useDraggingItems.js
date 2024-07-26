import { ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";

import { offsetDate, formatDate } from "@/utils/dates.js";

export default ({ editMode, cellWidth, selection } = {}) => {
  const dragging = ref(false);

  const draggingType = ref(null);
  const draggingDist = ref(0);

  const shadows = ref({});

  const onItemMousedown = (e, item = null, type = null) => {
    // 非編輯模式下也是可以選中 item 的
    if (e.ctrlKey) {
      selection.toggleSelect(item);
    } else {
      if (!selection.hasSelected(item)) {
        selection.select(item);
      }
    }

    if (!editMode.value) return;

    if (!selection.hasSelected(item)) return;

    dragging.value = true;

    draggingType.value = type;
    draggingDist.value = 0;

    // reset shadow every time on click
    shadows.value = {};
    selection.selectedItems.value.forEach((item) => {
      const { start_date, end_date } = item;
      shadows.value[item.id] = { start_date, end_date };
    });
  };

  useEventListener(document, "mousemove", (e) => {
    if (!editMode.value) return;

    if (!dragging.value || !draggingType.value) return;

    draggingDist.value += e.movementX;
    const diffs = Math.floor(draggingDist.value / cellWidth.value);

    selection.selectedItems.value.forEach((item) => {
      if (draggingType.value === "entire") {
        shadows.value[item.id] = {
          start_date: formatDate(offsetDate(item.start_date, diffs)),
          end_date: formatDate(offsetDate(item.end_date, diffs)),
        };
      }

      const shadow = shadows.value[item.id];
      if (!shadow) return;

      const datekey = `${draggingType.value}_date`;

      if (shadow[datekey]) {
        shadow[datekey] = formatDate(offsetDate(item[datekey], diffs));
      } else {
        shadow[datekey] = formatDate(new Date());
      }
    });
  });

  useEventListener(document, "mouseup", () => {
    if (!editMode.value) return;

    if (dragging.value && draggingType.value) {
      selection.selectedItems.value.forEach((item) => {
        const shadow = shadows.value[item.id];
        if (!shadow) return;

        item.start_date = shadow.start_date;
        item.end_date = shadow.end_date;
      });
    }

    dragging.value = false;
    draggingType.value = null;
    draggingDist.value = 0;
  });

  return { dragging, shadows, onItemMousedown };
};
