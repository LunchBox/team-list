<script setup>
import { computed, reactive, ref, watch } from "vue";

import { focusing } from "@/stores/nodes.js";

import {
  offsetDate,
  humanizeDate,
  daysDiff,
  formatDate,
} from "@/utils/dates.js";

import useEventListener from "@/utils/useEventListener.js";

import ItemView from "./ItemView.vue";

const props = defineProps(["list"]);

// const DAYS = 100;
const today = new Date();
const firstDayOffset = 3; // display from at least 3 days from firstday or today
const lastDayOffset = 10;

// default 3 days ago
const startDate = ref(offsetDate(today, -firstDayOffset));

const minStart = computed(() => {
  const listStartDates = props.list
    .filter((item) => item.start_date)
    .map((item) => new Date(item.start_date));

  if (listStartDates.length === 0) return today;

  return Math.min(...listStartDates);
});

const maxEnd = computed(() => {
  const listEndDates = props.list
    .filter((item) => item.end_date)
    .map((item) => new Date(item.end_date));

  if (listEndDates.length === 0) return today;

  return Math.max(...listEndDates);
});

const displayDays = computed(() => {
  const firstDay = startDate.value;
  let days = Math.ceil(daysDiff(maxEnd.value, firstDay));

  // at least display 30 days
  return Math.max(days, 30) + firstDayOffset + lastDayOffset;
});

const dates = computed(() => {
  const firstDay = startDate.value;
  const days = displayDays.value;

  return [...Array(days)].map((_, i) => {
    return offsetDate(firstDay, i);
  });
});

// update start date if any item changed the minimun start date
watch(
  minStart,
  () => {
    if (!minStart.value) return;
    console.log(minStart.value);
    const fd = Math.min(minStart.value, new Date());
    startDate.value = offsetDate(fd, -3);
  },
  { immediate: true }
);

const isWeekend = (d) => {
  return [0, 6].includes(d.getDay());
};

// display 3 slots for a task that have no start_date or end_date
const DEFAULT_TASK_DAYS = 3;

const CELL_WIDTH = 30;

const dragging = ref(null);
const draggingType = ref(null);
const draggingRow = ref(null);
const draggingDist = ref(0);

const shadow = reactive({
  start_date: null,
  end_date: null,
});

const draggingHandler = (item = null, type = null, row = null) => {
  dragging.value = item;
  draggingType.value = type;
  draggingRow.value = row;
  draggingDist.value = 0;

  // assign default dates
  if (!item.start_date) {
    item.start_date = formatDate(new Date());
    item.end_date = formatDate(offsetDate(new Date(), DEFAULT_TASK_DAYS - 1));
  } else if (!item.end_date) {
    item.end_date = formatDate(
      offsetDate(item.start_date, DEFAULT_TASK_DAYS - 1)
    );
  }

  const { start_date, end_date } = item;
  shadow.start_date = start_date;
  shadow.end_date = end_date;
};

useEventListener(document, "mousemove", (e) => {
  if (!dragging.value || !draggingType.value) return;
  draggingDist.value += e.movementX;

  const item = dragging.value;
  const moved = Math.round(draggingDist.value / CELL_WIDTH);

  if (draggingType.value === "entire") {
    shadow.start_date = formatDate(offsetDate(item.start_date, moved));
    shadow.end_date = formatDate(offsetDate(item.end_date, moved));
  }

  const datekey = `${draggingType.value}_date`;
  if (shadow[datekey]) {
    shadow[datekey] = formatDate(offsetDate(item[datekey], moved));
  } else {
    shadow[datekey] = formatDate(new Date());
  }
});

useEventListener(document, "mouseup", () => {
  const threshold = Math.abs(draggingDist.value) > CELL_WIDTH / 2;

  if (dragging.value && draggingType.value && threshold) {
    const item = dragging.value;
    item.start_date = shadow.start_date;
    item.end_date = shadow.end_date;
  }

  dragging.value = null;
  draggingType.value = null;
  draggingRow.value = null;
  draggingDist.value = 0;
});

const itemTitle = (item) => {
  return `${item.start_date} ~ ${item.end_date} ${item.content}`;
};

const fullColumnStyle = computed(() => {
  return {
    "grid-row-start": 3,
    "grid-row-end": 3 + props.list.length,
  };
});

const todayColumnStyle = computed(() => {
  let offset = Math.floor(daysDiff(new Date(), startDate.value));
  offset = Math.max(offset, 0);

  return {
    ...fullColumnStyle.value,
    "grid-column-start": offset + 1,
    "grid-column-end": offset + 2,
  };
});
</script>
<template>
  <div class="gantt-view" :style="{ '--cols': displayDays }">
    <div class="aside">
      <div class="row">&nbsp;</div>
      <div class="row">&nbsp;</div>
      <slot
        name="aside"
        @item-mousedown="(item, row) => draggingHandler(item, 'entire', row)"
      ></slot>
    </div>

    <div class="before-container">
      <slot name="before-container"></slot>
    </div>

    <div class="gantt-container">
      <!-- weeks -->
      <template v-for="(d, i) in dates">
        <div
          v-if="d.getDay() === 0"
          class="cell week"
          :style="{ 'grid-column': `${i + 1} / ${i + 8}` }"
        >
          {{ humanizeDate(d) }}
        </div>
      </template>

      <!-- days -->
      <div
        class="cell day"
        :class="{ weekend: isWeekend(d) }"
        v-for="d in dates"
      >
        {{ d.getDate() }}
      </div>

      <!-- weekend marks -->
      <template v-for="(d, i) in dates">
        <div
          v-if="d.getDay() === 0"
          class="weekend sunday"
          :style="{
            ...fullColumnStyle,
            'grid-column-start': 1 + i,
            'grid-column-end': 2 + i,
          }"
        >
          <!-- sunday -->
        </div>

        <div
          v-if="d.getDay() === 6"
          class="weekend saturday"
          :style="{
            ...fullColumnStyle,
            'grid-column-start': 8 + i,
            'grid-column-end': 9 + i,
          }"
        >
          <!-- saturday -->
        </div>
      </template>

      <!-- today marker -->
      <div class="today" :style="todayColumnStyle"></div>

      <ItemView
        v-if="dragging"
        class="shadow"
        :item="shadow"
        :row="draggingRow"
        :start="startDate"
      ></ItemView>

      <template v-for="(item, row) in list">
        <div
          v-if="focusing === item"
          class="focusing"
          :style="{
            'grid-row-start': row + 3,
            'grid-row-end': row + 4,
            'grid-column-start': 1,
            'grid-column-end': displayDays + 1,
          }"
        ></div>

        <ItemView
          :item="item"
          :row="row"
          :start="startDate"
          :id="item.id"
          :title="itemTitle(item)"
          @dragging="(type) => draggingHandler(item, type, row)"
          @click="focusing = item"
        >
          <span>
            {{ item.content }}
          </span>
        </ItemView>
      </template>
    </div>
  </div>
</template>

<style scoped>
.gantt-view {
  --line-height: 1.6rem;
  --cols: 20;

  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  grid-template-rows: auto auto;

  align-items: stretch;
  line-height: var(--line-height);
}

.aside {
  grid-column: 1 / 2;
  grid-row: 2 / 3;

  padding: 2px 0;
}
:deep(.aside .list-item .node-content) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* :deep(.aside .list-item.active > .list-item-row) {
  background-color: rgba(0, 0, 0, 0.1);
} */

.before-container {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}
.gantt-container {
  grid-column: 3 / 4;
  grid-row: 2 / 3;

  overflow-x: scroll;
}

.gantt-container {
  display: grid;
  grid-template-columns: repeat(var(--cols), 2rem);
  grid-auto-rows: var(--line-height);

  gap: 2px 0;
  height: 100%;
  padding: 0 2px;
  padding-right: 20rem;

  .cell {
    background: #fff;
    height: var(--line-height);
    display: grid;
    place-items: center;
    padding: 0 4px;

    &.day {
      grid-row-start: 2;
    }

    &.week {
      justify-content: flex-start;
      font-weight: 700;
      font-size: small;
    }
  }
  .weekend {
    background: #efefef;
  }

  .today {
    position: relative;

    &:before {
      content: " ";
      position: absolute;
      width: 1px;
      height: 100%;
      top: 0;
      left: 50%;
      background: #c30;
    }
  }

  .shadow {
    background: rgba(0, 0, 0, 0.3);
  }

  .focusing {
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
