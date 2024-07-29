<script setup>
import { ref, computed, toValue, watchEffect } from "vue";
import useEventListener from "@/utils/useEventListener";

const props = defineProps(["width", "scrollLeft", "scrollWidth"]);
const emit = defineEmits(["handler-move"]);

const NAV_HEIGHT = 64;

const rate = computed(() => {
  const { width, scrollWidth } = props;
  return width / scrollWidth;
});

const handlerLeft = computed(() => props.scrollLeft * rate.value);

const containerStyle = computed(() => {
  return {
    "--height": `${NAV_HEIGHT}px`,
    "--handler-width": `${toValue(rate) * 100}%`,
  };
});

const handlerStyle = computed(() => {
  return { left: `${handlerLeft.value}px` };
});

const dragging = ref(false);

const onMousedown = (e) => {
  dragging.value = true;

  const { width } = props;

  const handlerWidth = width * rate.value;
  const diff = (e.offsetX - handlerLeft.value - handlerWidth / 2) / rate.value;
  emit("handler-move", diff);
};

useEventListener(document, "mousemove", (e) => {
  if (dragging.value) {
    emit("handler-move", e.movementX / rate.value);
  }
});

useEventListener(document, "mouseup", (e) => {
  dragging.value = false;
});
</script>

<template>
  <div class="gantt-nav" :style="containerStyle" @mousedown.left="onMousedown">
    <slot></slot>
    <div class="handler" :style="handlerStyle"></div>
  </div>
</template>

<style scoped>
.gantt-nav {
  height: var(--height);
  background: rgba(0, 0, 0, 0.2);

  position: sticky;
  bottom: 0;

  user-select: none;

  .handler {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--hanlder-left);
    width: var(--handler-width);

    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
}
</style>
