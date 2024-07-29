import { computed, ref, watch } from "vue";
import useEventListener from "@/utils/useEventListener.js";

export default (containerEl) => {
  const draggingContainer = ref(false);

  const scrollLeft = ref(0);

  // outer width
  const containerWidth = ref(0);

  // inner scrollable width
  const containerScrollWidth = ref(0);

  const handlerWidth = computed(() => {
    return (
      (containerWidth.value * containerWidth.value) / containerScrollWidth.value
    );
  });

  const scrollContainer = (diff) => {
    scrollLeft.value += diff;

    // should not less than 0
    scrollLeft.value = Math.max(scrollLeft.value, 0);

    // should not over container
    scrollLeft.value = Math.min(
      scrollLeft.value,
      containerScrollWidth.value - containerWidth.value
    );
  };

  watch(scrollLeft, () => {
    if (!containerEl.value) return;
    containerEl.value.scrollLeft = scrollLeft.value;
  });

  const updateSize = () => {
    console.log("-- update size");
    const { width } = containerEl.value?.getBoundingClientRect() || {};
    containerWidth.value = width;
    containerScrollWidth.value = containerEl.value?.scrollWidth;
  };

  useEventListener(window, "mousemove", (e) => {
    if (draggingContainer.value) {
      scrollContainer(-e.movementX);
    }
  });

  useEventListener(window, "mouseup", () => {
    draggingContainer.value = false;
  });

  return {
    containerWidth,
    containerScrollWidth,
    scrollLeft,
    draggingContainer,
    scrollContainer,
    updateSize,
  };
};
