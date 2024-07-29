<script setup>
import { computed } from "vue";

import { daysDiff } from "@/utils/dates.js";

import { dateToGridColumn } from "./utils.js";

const props = defineProps([
  "item",
  "start_date",
  "end_date",
  "row",
  "start",
  "fixed",
]);
const emit = defineEmits(["item-mousedown"]);

const DEFAULT_TASK_DAYS = 3;

const cellStyle = computed(() => {
  const { row, start } = props;
  const { start_date, end_date } = props;

  let colStart = new Date().getDay() + 1;
  if (start_date) {
    colStart = dateToGridColumn(start_date, start);
  }

  let colLen = DEFAULT_TASK_DAYS - 1;
  if (start_date && end_date) {
    colLen = Math.floor(daysDiff(end_date, start_date));
    colLen = Math.max(colLen, 0);
  }

  return {
    "grid-row-start": 3 + row,
    "grid-row-end": 4 + row,
    "grid-column-start": colStart,
    "grid-column-end": colStart + colLen + 1,
  };
});

const onMousedown = (e, draggingType) => {
  if (props.fixed) return;
  emit("item-mousedown", e, draggingType);
};
</script>
<template>
  <div
    class="grid-item"
    v-bind="$attrs"
    :class="{ fixed }"
    :style="cellStyle"
    @mousedown.stop="onMousedown($event, 'entire')"
  >
    <div
      class="handler start"
      @mousedown.stop="onMousedown($event, 'start')"
    ></div>
    <span>
      <slot></slot>
    </span>
    <div class="handler end" @mousedown.stop="onMousedown($event, 'end')"></div>
  </div>
</template>

<style scoped>
.grid-item {
  position: relative;
  font-size: smaller;

  padding: 0 0.5rem;

  user-select: none;

  > span {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .handler {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;

    cursor: col-resize;
  }

  .handler.start {
    left: 0;
  }

  .handler.end {
    right: 0;
  }

  &.fixed {
    .handler {
      display: none;
    }
  }

  .event-through {
    pointer-events: none;
  }
}
</style>
