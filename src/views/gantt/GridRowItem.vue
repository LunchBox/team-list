<script setup>
import { computed } from "vue";

import { daysDiff } from "@/utils/dates.js";

import { dateToGridColumn } from "./utils.js";

const props = defineProps(["item", "row", "start"]);
const emit = defineEmits(["item-mousedown"]);

const DEFAULT_TASK_DAYS = 3;

const itemCellStyle = computed(() => {
  const { item, row, start } = props;
  const { start_date, end_date } = item;

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

const bgStyle = computed(() => {
  const { item, row, start } = props;

  const { start_date, end_date } = item;

  let colStart = new Date().getDay() + 1;
  if (start_date) {
    colStart = dateToGridColumn(start_date, start);
  }

  let colLen = DEFAULT_TASK_DAYS - 1;
  const ed = item.maxChildEndDate;
  if (start_date && ed) {
    colLen = Math.floor(daysDiff(ed, start_date));
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
  emit("item-mousedown", e, draggingType);
};
</script>
<template>
  <div class="item-bg" :style="bgStyle"></div>
  <div
    class="item"
    v-bind="$attrs"
    :style="itemCellStyle"
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
.item-bg {
  position: relative;
}
.item-bg:before {
  content: " ";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background-color: #555;
}
.item {
  position: relative;
  font-size: smaller;
  background: #769585ed;
  color: #fff;
  padding: 0 0.5rem;

  user-select: none;

  > span {
    display: block;
    width: 100%;
    height: 100%;
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

  .event-through {
    pointer-events: none;
  }
}
</style>
