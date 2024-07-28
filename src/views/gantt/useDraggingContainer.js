import { ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";

export default (posRef) => {
  const draggingContainer = ref(false);

  useEventListener(window, "mousemove", (e) => {
    if (draggingContainer.value) {
      posRef.value -= e.movementX;
      posRef.value = Math.max(posRef.value, 0);
    }
  });

  useEventListener(window, "mouseup", () => {
    draggingContainer.value = false;
  });

  return {
    draggingContainer,
  };
};
