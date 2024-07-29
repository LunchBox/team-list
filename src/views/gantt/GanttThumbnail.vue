<script setup>
import { computed } from "vue";
import { daysDiff } from "@/utils/dates.js";
import { dateToGridColumn } from "./utils";

const props = defineProps(["list", "days", "width", "scrollWidth", "start"]);
const emit = defineEmits(["handler-move"]);

const NAV_HEIGHT = 64;

const containerStyle = computed(() => {
  const { days = 1, list } = props;
  return {
    "--cols": days,
    "--row-h": list.length > 0 ? NAV_HEIGHT / list.length : 1,
    "--height": `${NAV_HEIGHT}px`,
  };
});

const itemStyle = (item, row) => {
  console.log("here");
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
</script>

<template>
  <div class="thumbnail" :style="containerStyle">
    <div
      v-for="(item, row) in list"
      :style="itemStyle(item, row)"
      class="item"
    ></div>
  </div>
</template>

<style scoped>
.thumbnail {
  --row-h: 1px;

  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-auto-rows: var(--row-h);
  /* gap: 1px 0; */

  height: var(--height);
  background: rgba(0, 0, 0, 0.2);

  position: sticky;
  bottom: 0;

  .item {
    background: #444;
    pointer-events: none;
    user-select: none;
  }
}
</style>
