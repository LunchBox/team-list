import { ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";

export default (containerEl) => {
  const draggingContainer = ref(false);

  useEventListener(window, "mousemove", (e) => {
    if (draggingContainer.value && containerEl.value) {
      containerEl.value.scrollLeft -= e.movementX;
    }
  });

  useEventListener(window, "mouseup", () => {
    draggingContainer.value = false;
  });

  return {
    draggingContainer,
  };
};
