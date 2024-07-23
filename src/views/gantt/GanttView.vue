<script setup>
import { computed, reactive, ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";

import ItemView from "./ItemView.vue";

defineProps(["list"]);

const offsetDate = (date, offset) => {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d;
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

const shadowStyle = computed(() => {});

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

  console.log(shadow);

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

        <template v-for="(item, row) in list">
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
  border-left: 2px solid #aaa;
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

  .shadow {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
