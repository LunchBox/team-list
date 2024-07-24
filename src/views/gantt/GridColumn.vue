<script setup>
import { ref, computed } from "vue";
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

const hover = ref(false);
</script>

<template>
  <div
    class="col"
    :class="{ hover }"
    :style="colStyle"
    @dragenter="hover = true"
    @dragleave="hover = false"
    @drop="hover = false"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.col {
  position: relative;
}
.hover {
}
.hover:before {
  content: " ";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: #ccc;
}
</style>
