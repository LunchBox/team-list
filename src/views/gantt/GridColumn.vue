<script setup>
import { computed } from "vue";
import { dateToGridColumn } from "./utils.js";

const props = defineProps({
  date: Date,
  startDate: Date,
  rows: Number,
  cols: { type: Number, default: 1 },
});

const ROW_START = 3;

const colStart = computed(() => {
  const { date, startDate } = props;
  return dateToGridColumn(date, startDate);
});

const colStyle = computed(() => {
  const { rows, cols } = props;
  return {
    "grid-row-start": ROW_START,
    "grid-row-end": ROW_START + rows,
    "grid-column-start": colStart.value,
    "grid-column-end": colStart.value + cols,
  };
});
</script>

<template>
  <div :style="colStyle">
    <slot></slot>
  </div>
</template>
