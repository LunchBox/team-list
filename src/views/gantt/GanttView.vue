<script setup>
import { computed, ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";

defineProps(["list"]);

const offsetDate = (date, offset) => {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d;
};

const daysDiff = (d1, d2) => {
  const t = new Date(d1);
  const f = new Date(d2);
  return (t - f) / 3600 / 24 / 1000;
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const humanizeDate = (date) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month}${day}, ${year}`;
};

const WEEKS = 13;
const DAYS = 7 * WEEKS;
const today = new Date();

const startDate = ref(offsetDate(today, -today.getDay()));

const dates = computed(() => {
  return [...Array(DAYS)].map((_, i) => {
    return offsetDate(startDate.value, i);
  });
});

const isWeekend = (d) => {
  return [0, 6].includes(d.getDay());
};

const DEFAULT_TASK_DAYS = 3;
const itemCellStyle = (item, row) => {
  const { start_date, end_date } = item;
  let colStart = new Date().getDay() + 1;
  if (start_date) {
    colStart = Math.floor(daysDiff(start_date, startDate.value)) + 2;
  }

  let colLen = DEFAULT_TASK_DAYS - 1;
  if (start_date && end_date) {
    colLen = Math.floor(daysDiff(end_date, start_date));
    colLen = Math.max(colLen, 1);
  }

  return {
    "grid-row-start": 3 + row,
    "grid-row-end": 4 + row,
    "grid-column-start": colStart,
    "grid-column-end": colStart + colLen + 1,
  };
};

const itemTitle = (item) =>
  `${item.start_date} ~ ${item.end_date} ${item.content}`;

const CELL_WIDTH = 30;

const dragging = ref(null);
const draggingType = ref(null);
const draggingDist = ref(0);
const draggingHandler = (item, type) => {
  dragging.value = item;
  draggingType.value = type;
  draggingDist.value = 0;
};

useEventListener(document, "mousemove", (e) => {
  if (!dragging.value || !draggingType.value) return;
  draggingDist.value += e.movementX;
});

useEventListener(document, "mouseup", () => {
  const threshold = Math.abs(draggingDist.value) > CELL_WIDTH / 2;
  console.log(threshold);

  if (dragging.value && draggingType.value && threshold) {
    const item = dragging.value;

    // assign default dates
    if (!item.start_date) {
      item.start_date = formatDate(new Date());
      item.end_date = formatDate(offsetDate(new Date(), DEFAULT_TASK_DAYS - 1));
    } else if (!item.end_date) {
      item.end_date = formatDate(
        offsetDate(item.start_date, DEFAULT_TASK_DAYS - 1)
      );
    }

    const moved = Math.round(draggingDist.value / CELL_WIDTH);

    if (draggingType.value === "entire") {
      item.start_date = formatDate(offsetDate(item.start_date, moved));
      item.end_date = formatDate(offsetDate(item.end_date, moved));
    }

    const datekey = `${draggingType.value}_date`;
    if (item[datekey]) {
      item[datekey] = formatDate(offsetDate(item[datekey], moved));
    } else {
      item[datekey] = formatDate(new Date());
    }
  }

  dragging.value = null;
  draggingType.value = null;
  draggingDist.value = 0;
});
</script>
<template>
  <div>
    <div>Gantt View</div>
    <div class="gantt-view">
      <aside>
        <div class="row">&nbsp;</div>
        <div class="row">&nbsp;</div>
        <div v-for="item in list" class="row">
          <a :href="`#${item.id}`">
            {{ item.content }}
          </a>
        </div>
      </aside>
      <main>
        <!-- weeks -->
        <template v-for="d in dates">
          <div
            v-if="d.getDay() === 0"
            class="cell week"
            :style="{ 'grid-column': `span ${7 - d.getDay()}` }"
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
        <template v-for="(_, i) in WEEKS">
          <!-- sunday -->
          <div
            class="weekend"
            :style="{
              'grid-row-start': 3,
              'grid-row-end': 3 + list.length,
              'grid-column-start': 1 + 7 * i,
              'grid-column-end': 2 + 7 * i,
            }"
          ></div>
          <!-- saturday -->
          <div
            class="weekend"
            :style="{
              'grid-row-start': 3,
              'grid-row-end': 3 + list.length,
              'grid-column-start': 7 + 7 * i,
              'grid-column-end': 8 + 7 * i,
            }"
          ></div>
        </template>

        <!-- tasks -->
        <div
          v-for="(item, row) in list"
          class="item"
          :id="item.id"
          :style="itemCellStyle(item, row)"
          :title="itemTitle(item)"
          @mousedown.stop="draggingHandler(item, 'entire')"
        >
          <div
            class="handler start"
            @mousedown.stop="draggingHandler(item, 'start')"
          ></div>
          <span>
            {{ item.content }}
          </span>
          <div
            class="handler end"
            @mousedown.stop="draggingHandler(item, 'end')"
          ></div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.gantt-view {
  --line-height: 2rem;
  display: flex;
  align-items: stretch;
  line-height: var(--line-height);
}

aside {
  flex: 0 0 30%;
  width: 30%;
}

main {
  flex: 0 0 70%;
  width: 70%;
  overflow-x: scroll;
  border-left: 2px solid #333;
}

main {
  display: grid;
  grid-template-columns: repeat(91, var(--line-height));
  grid-auto-rows: 2rem;

  gap: 0;
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

  .item {
    font-size: smaller;
    background: #c2edd5e6;
    position: relative;
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
  }
}
</style>
