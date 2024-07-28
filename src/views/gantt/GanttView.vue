<script setup>
import { computed, ref, nextTick } from "vue";

import { humanizeDate, formatDate } from "@/utils/dates.js";

import useDates from "./useDates.js";
import useDraggingItems from "./useDraggingItems.js";
import useDraggingContainer from "./useDraggingContainer.js";

import useDroppable from "./useDropable.js";

import GanttNav from "./GanttNav.vue";
import GridRowItem from "./GridRowItem.vue";
import GridColumn from "./GridColumn.vue";

const props = defineProps(["list", "selection"]);

const selectedItems = computed(() => props.selection?.selectedItems.value);

const editMode = ref(false);
const cellWidth = ref(32);
const scrollLeft = ref(0);

const targetDate = ref(formatDate(new Date()));

const onHandlerMove = (diff) => {
  if (!containerEl.value) return;
  containerEl.value.scrollLeft += diff;
  if (containerEl.value.scrollLeft < 0) containerEl.value.scrollLeft = 0;
};

const scrollTo = () => {
  nextTick(() => {
    // const el = document.querySelector(`#d_${formatDate(targetDate.value)}`);
    // console.log(el);
    // if (el) {
    //   el.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //     inline: "nearest",
    //   });
    // }
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
const { dragging, shadows, onItemMousedown } = useDraggingItems({
  editMode,
  cellWidth,
  selection: props.selection,
});

//  drag & drop item
const { onDropToDate } = useDroppable({ editMode, selection: props.selection });

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
      <GanttNav
        :list="list"
        :days="totalDays"
        :start="startDate"
        :width="totalDays * cellWidth"
        :scrollLeft="scrollLeft"
        @handler-move="onHandlerMove"
      ></GanttNav>
    </div>

    <div
      class="gantt-container"
      ref="containerEl"
      @mousedown.left="draggingContainer = true"
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
        :class="{ weekend: isWeekend(d), selected: selectedDate === d }"
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

      <GridColumn
        v-show="selectedDate"
        class="selected-day"
        :rows="list.length"
        :startDate="startDate"
        :date="selectedDate"
      ></GridColumn>

      <!-- droppable area -->
      <GridColumn
        v-for="d in dates"
        class="droppable"
        :class="{
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

      <!-- highlight entire row of selection -->
      <template v-if="selection">
        <div
          v-for="item in selectedItems"
          class="row selected"
          :style="{
            'grid-row-start': rowOf(item) + 3,
            'grid-row-end': rowOf(item) + 4,
            'grid-column-start': 1,
            'grid-column-end': totalDays + 1,
          }"
        ></div>
      </template>

      <!-- shadow item to indicate the positions -->
      <template v-if="dragging">
        <GridRowItem
          v-for="item in selectedItems"
          class="shadow"
          :start_date="shadows[item.id]?.start_date"
          :end_date="shadows[item.id]?.end_date"
          :row="rowOf(item)"
          :start="startDate"
        ></GridRowItem>
      </template>

      <!-- the draggable items -->
      <template v-for="item in scheduledList">
        <GridRowItem
          class="event-through item-bg"
          :start_date="item.minChildStartDate"
          :end_date="item.maxChildEndDate"
          :row="rowOf(item)"
          :start="startDate"
        >
        </GridRowItem>
        <GridRowItem
          class="item"
          :start_date="item.start_date"
          :end_date="item.end_date"
          :row="rowOf(item)"
          :start="startDate"
          :title="itemTitle(item)"
          :class="{ 'event-through': dragging && selection?.hasSelected(item) }"
          @item-mousedown="(e, type) => onItemMousedown(e, item, type)"
        >
          <span>
            {{ item.content }}
          </span>
        </GridRowItem>
      </template>
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

    &.day.selected {
      background: #ffd891;
    }

    &.week {
      justify-content: flex-start;
      font-weight: 700;
      font-size: small;
      min-width: 100px;
    }
  }

  .selected-day,
  .today {
    position: relative;

    &:before {
      content: " ";
      position: absolute;
      width: 2px;
      height: 100%;
      top: 0;
      left: calc(50% - 1px);
      background: darkolivegreen;
    }
  }
  .selected-day {
    &:before {
      background: #ffd891;
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

  .row.selected {
    background: rgba(0, 0, 0, 0.1);
  }

  .item {
    color: #222;

    &:before {
      content: " ";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border: 2px solid #444;
    }
  }

  /* 通常看到這條線的都是 over time 的 task.. */
  .item-bg {
    position: relative;

    &:before {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 2px solid #c30;
    }
  }
}
</style>
