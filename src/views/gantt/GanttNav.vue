<script setup>
import { ref, computed, nextTick, toValue } from "vue";
import { daysDiff } from "@/utils/dates.js";
import { dateToGridColumn } from "./utils";
import useEventListener from "@/utils/useEventListener";

const props = defineProps(["list", "days", "width", "start"]);
const emit = defineEmits(["handler-move"]);

const NAV_HEIGHT = 64;

const containerRef = ref(null);

const containerWidth = ref(0);
const handlerLeft = ref(0);

nextTick(() => {
  const { width } = containerRef.value?.getBoundingClientRect() || {};
  containerWidth.value = width;
});

const rate = computed(() => {
  const { width } = props;
  const cw = toValue(containerWidth);
  return cw / width;
});

const containerStyle = computed(() => {
  const { days = 1, list } = props;
  return {
    "--cols": days,
    "--row-h": list.length > 0 ? NAV_HEIGHT / list.length : 1,
    "--height": `${NAV_HEIGHT}px`,
    "--handler-width": `${toValue(rate) * 100}%`,
  };
});

const itemStyle = (item, row) => {
  const { start } = props;
  const { start_date, end_date } = item;

  if (!start_date || !end_date) return { display: "none" };

  const colStart = dateToGridColumn(start_date, start);

  let colLen = Math.floor(daysDiff(end_date, start_date));
  colLen = Math.max(colLen, 0);

  return {
    "grid-row-start": 1 + row,
    "grid-row-end": 2 + row,
    "grid-column-start": colStart,
    "grid-column-end": colStart + colLen + 1,
  };
};

const dragging = ref(false);
useEventListener(window, "mousemove", (e) => {
  if (dragging.value) {
    handlerLeft.value += e.movementX;
    if (handlerLeft.value < 0) handlerLeft.value = 0;
    emit("handler-move", e.movementX / rate.value);
  }
});

useEventListener(window, "mouseup", (e) => {
  dragging.value = false;
});
</script>

<template>
  <div class="gantt-nav" :style="containerStyle" ref="containerRef">
    <div
      v-for="(item, row) in list"
      :style="itemStyle(item, row)"
      class="item"
    ></div>
    <div
      class="handler"
      :style="{ left: `${handlerLeft}px` }"
      @mousedown.left="dragging = true"
    ></div>
  </div>
</template>

<style scoped>
.gantt-nav {
  --row-h: 1px;

  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-auto-rows: var(--row-h);
  /* gap: 1px 0; */

  height: var(--height);
  background: #efefef;

  position: relative;

  .item {
    background: #999;
    border: 1px solid #efefef;
    pointer-events: none;
  }

  .handler {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--hanlder-left);
    width: var(--handler-width);

    border: 1px solid #ccc;
    user-select: none;
  }
}
</style>
