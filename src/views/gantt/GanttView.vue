<script setup>
import { computed, reactive, ref, watch } from "vue";

import { focusing } from "@/stores/nodes.js";

import useEventListener from "@/utils/useEventListener.js";

import ItemView from "./ItemView.vue";

const props = defineProps(["list"]);

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

  return `${month} ${day}, ${year}`;
};

const DAYS = 100;
const today = new Date();

// default 3 days ago
const startDate = ref(offsetDate(today, -3));

const minStart = computed(() => {
  const ds = props.list
    .filter((item) => item.start_date)
    .map((item) => new Date(item.start_date));

  return Math.min(...ds);
});

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

const dates = computed(() => {
  return [...Array(DAYS)].map((_, i) => {
    return offsetDate(startDate.value, i);
  });
});

const isWeekend = (d) => {
  return [0, 6].includes(d.getDay());
};

const DEFAULT_TASK_DAYS = 3;

const CELL_WIDTH = 30;

const dragging = ref(null);
const draggingType = ref(null);
const draggingDist = ref(0);

const shadow = reactive({
  start_date: null,
  end_date: null,
});

const draggingHandler = (item, type) => {
  dragging.value = item;
  draggingType.value = type;
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
  <div class="gantt-view">
    <aside>
      <div class="row">&nbsp;</div>
      <div class="row">&nbsp;</div>
      <slot name="aside"></slot>
    </aside>

    <main>
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

      <template v-for="(item, row) in list">
        <div
          v-if="focusing === item"
          class="focusing"
          :style="{
            'grid-row-start': row + 3,
            'grid-row-end': row + 4,
            'grid-column-start': 1,
            'grid-column-end': DAYS + 1,
          }"
        ></div>

        <ItemView
          v-if="dragging === item"
          class="shadow"
          :item="shadow"
          :row="row"
          :start="startDate"
        ></ItemView>

        <ItemView
          :item="item"
          :row="row"
          :start="startDate"
          :id="item.id"
          :title="itemTitle(item)"
          @dragging="(type) => draggingHandler(item, type)"
        >
          {{ item.content }}
        </ItemView>
      </template>
    </main>
  </div>
</template>

<style scoped>
.gantt-view {
  --line-height: 1.6rem;
  display: flex;
  align-items: stretch;
  line-height: var(--line-height);
}

aside {
  flex: 0 0 30%;
  width: 30%;
  padding: 2px 0;
}
:deep(aside .list-item .node-content) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(aside .list-item.active > .list-item-row) {
  background-color: rgba(0, 0, 0, 0.1);
}

main {
  flex: 0 0 70%;
  width: 70%;
  overflow-x: scroll;
}

main {
  display: grid;
  grid-template-columns: repeat(91, 2rem);
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
