<script setup>
import { computed, ref, nextTick } from "vue";

import { focusing } from "@/stores/nodes.js";

import { humanizeDate, formatDate } from "@/utils/dates.js";

import useDates from "./useDates.js";
import useDraggingItems from "./useDraggingItems.js";
import useDraggingContainer from "./useDraggingContainer.js";

import useDroppable from "./useDropable.js";

import GridRowItem from "./GridRowItem.vue";
import GridColumn from "./GridColumn.vue";

const props = defineProps(["list"]);

const editMode = ref(false);
const cellWidth = ref(32);

const targetDate = ref(formatDate(new Date()));

const scrollTo = () => {
  nextTick(() => {
    const el = document.querySelector(`#d_${formatDate(targetDate.value)}`);
    console.log(el);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  });
};

// only show items that have start and end date
const scheduledList = computed(() => {
  return props.list.filter((t) => t.start_date && t.end_date);
});

// util functions
const isWeekend = (d) => [0, 6].includes(d.getDay());
const rowOf = (item) => props.list.indexOf(item);

const today = new Date();

// init dates
const { startDate, totalDays, dates } = useDates(props, today);

// dragging items
const { dragging, shadow, draggingHandler } = useDraggingItems(
  editMode,
  cellWidth
);

//  drag & drop item
const { onDropToDate } = useDroppable(editMode);

// dragging container
const containerEl = ref(null);
const { draggingContainer } = useDraggingContainer(containerEl);

// others
const itemTitle = (item) => {
  return `${item.start_date} ~ ${item.end_date} ${item.content}`;
};

const generalStyle = computed(() => {
  return { "--cols": totalDays.value, "--cell-width": `${cellWidth.value}px` };
});

const selectedDate = ref(null);
</script>
<template>
  <div class="gantt-view" :style="generalStyle">
    <div class="before-aside">
      <slot name="before-aside"></slot>
    </div>

    <div class="aside">
      <div class="row">
        mode: <strong>{{ editMode ? "Edit" : "View" }}</strong> &middot;
        <button @click.prevent="editMode = !editMode">toggle</button>
      </div>
      <div class="row">&nbsp;</div>
      <slot name="aside"></slot>
    </div>

    <div class="before-container">
      <div class="flex">
        <slot name="before-container"></slot>

        <form style="margin-left: auto" @submit.prevent="scrollTo">
          <input type="date" v-model="targetDate" />
          <input type="submit" value="Goto" />
        </form>
      </div>
    </div>

    <div
      class="gantt-container"
      ref="containerEl"
      @mousedown="draggingContainer = true"
    >
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

      <!-- days in header -->
      <div
        v-for="d in dates"
        class="cell day"
        :id="`d_${formatDate(d)}`"
        :class="{ weekend: isWeekend(d) }"
      >
        <span>{{ d.getDate() }}</span>
      </div>

      <!-- today marker -->
      <GridColumn
        class="today"
        :rows="list.length"
        :startDate="startDate"
        :date="today"
      ></GridColumn>

      <!-- droppable area -->
      <GridColumn
        v-for="d in dates"
        class="droppable"
        :class="{
          selected: selectedDate === d,
          weekend: isWeekend(d),
          sunday: d.getDay() === 0,
          saturday: d.getDay() === 6,
        }"
        :rows="list.length"
        :startDate="startDate"
        :date="d"
        :title="formatDate(d)"
        @mousedown="selectedDate = d"
        @drop="onDropToDate(d)"
        @dragover.prevent
      ></GridColumn>

      <!-- highlight entire row -->
      <div
        v-if="focusing"
        class="row focusing"
        :style="{
          'grid-row-start': rowOf(focusing) + 3,
          'grid-row-end': rowOf(focusing) + 4,
          'grid-column-start': 1,
          'grid-column-end': totalDays + 1,
        }"
      ></div>

      <!-- shadow item to indicate the positions -->
      <GridRowItem
        v-if="dragging"
        class="shadow"
        :item="shadow"
        :row="rowOf(dragging)"
        :start="startDate"
      ></GridRowItem>

      <!-- the draggable items -->
      <GridRowItem
        v-for="item in scheduledList"
        :item="item"
        :row="rowOf(item)"
        :start="startDate"
        :id="item.id"
        :title="itemTitle(item)"
        :class="{ 'event-through': dragging === item }"
        @dragging="(type) => draggingHandler(item, type)"
        @click="focusing = item"
      >
        <span>
          {{ item.content }}
        </span>
      </GridRowItem>
    </div>
  </div>
</template>

<style scoped>
strong {
  font-weight: 700;
}
.gantt-view {
  --line-height: 1.6rem;
  --cell-width: 32;
  --cols: 20;

  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  grid-template-rows: auto auto;

  align-items: stretch;
  line-height: var(--line-height);
}

.before-aside {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.aside {
  grid-column: 1 / 2;
  grid-row: 2 / 3;

  padding: 2px 0;
}

.aside a {
  white-space: nowrap;
}
:deep(.aside .list-item .node-content) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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
  grid-template-columns: repeat(var(--cols), var(--cell-width));
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

  .event-through {
    pointer-events: none;
  }

  .shadow {
    user-select: none;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.3);
  }

  .weekend {
    background: rgba(0, 0, 0, 0.1);
  }

  .weekend.selected,
  .droppable.selected {
    background-color: #ff9d004f;
  }

  .row.focusing {
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
