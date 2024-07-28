import { ref, watch } from "vue";
import useEventListener from "@/utils/useEventListener.js";

export default (containerEl) => {
  const draggingContainer = ref(false);
  const scrollLeft = ref(0);

  const scrollContainer = (diff) => {
    scrollLeft.value += diff;
    scrollLeft.value = Math.max(scrollLeft.value, 0);
  };

  watch(scrollLeft, () => {
    if (!containerEl.value) return;
    containerEl.value.scrollLeft = scrollLeft.value;
  });

  useEventListener(window, "mousemove", (e) => {
    if (draggingContainer.value) {
      scrollContainer(-e.movementX);
    }
  });

  useEventListener(window, "mouseup", () => {
    draggingContainer.value = false;
  });

  return {
    scrollLeft,
    draggingContainer,
    scrollContainer,
  };
};
