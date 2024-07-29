<script setup>
import { computed, ref, nextTick, watch } from "vue";

import { humanizeDate, formatDate } from "@/utils/dates.js";
import { dateToGridColumn } from "./utils";

import useDates from "./useDates.js";
import useDraggingItems from "./useDraggingItems.js";
import useDraggingContainer from "./useDraggingContainer.js";

import useDroppable from "./useDropable.js";

import GridRowItem from "./GridRowItem.vue";
import GridColumn from "./GridColumn.vue";

import GanttNav from "./GanttNav.vue";
import GanttThumbnail from "./GanttThumbnail.vue";

const props = defineProps(["list", "selection"]);

const selectedItems = computed(() => props.selection?.selectedItems.value);

const selectedDate = ref(formatDate(new Date()));

const editMode = ref(false);
const cellWidth = ref(32);

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

const {
  containerWidth,
  containerScrollWidth,
  scrollLeft,
  draggingContainer,
  scrollContainer,
  updateSize,
} = useDraggingContainer(containerEl);

nextTick(updateSize);
watch(dates, () => nextTick(updateSize));

// scroll to date
const scrollToDate = (date) => {
  const col = dateToGridColumn(date, startDate.value) - 4;
  const dist = col * cellWidth.value;
  scrollContainer(dist - scrollLeft.value);
};

const scrollTo = () => {
  nextTick(() => scrollToDate(selectedDate.value));
};

nextTick(() => scrollToDate(today));

// zoom in & out

const zoomOut = () => {
  cellWidth.value += 4;

  updateSize();
};

const zoomIn = () => {
  cellWidth.value -= 4;
  cellWidth.value = Math.max(cellWidth.value, 8);

  updateSize();
};

const tinyLayout = computed(() => cellWidth.value < 24);
const regularLayout = computed(() => cellWidth.value >= 24);

// others
const itemTitle = (item) => {
  return `${item.start_date} ~ ${item.end_date} ${item.content}`;
};

const generalStyle = computed(() => {
  return { "--cols": totalDays.value, "--cell-width": `${cellWidth.value}px` };
});
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

        <div style="margin-left: auto" class="flex">
          <button @click="zoomIn">Zoom In</button>
          <button @click="zoomOut">Zoom Out</button>
          <form @submit.prevent="scrollTo">
            <input type="date" v-model="selectedDate" @change="scrollTo" />
            <input type="submit" value="Goto" />
          </form>
        </div>
      </div>
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
        :class="{
          weekend: isWeekend(d),
          selected: selectedDate === formatDate(d),
        }"
        @mousedown.left="selectedDate = formatDate(d)"
      >
        <span v-show="regularLayout">{{ d.getDate() }}</span>
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
        :date="new Date(selectedDate)"
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
          :class="{
            regular: regularLayout,
            tiny: tinyLayout,
          }"
        >
        </GridRowItem>
        <GridRowItem
          class="item"
          :start_date="item.start_date"
          :end_date="item.end_date"
          :row="rowOf(item)"
          :start="startDate"
          :title="itemTitle(item)"
          :class="{
            'event-through': dragging && selection?.hasSelected(item),
            regular: regularLayout,
            tiny: tinyLayout,
          }"
          @item-mousedown="(e, type) => onItemMousedown(e, item, type)"
        >
          <span v-show="regularLayout">
            {{ item.content }}
          </span>
        </GridRowItem>
      </template>
    </div>

    <GanttNav
      :width="containerWidth"
      :scrollWidth="containerScrollWidth"
      :scrollLeft="scrollLeft"
      @handler-move="scrollContainer"
    >
      <GanttThumbnail
        :list="list"
        :days="totalDays"
        :start="startDate"
        :width="containerWidth"
        :scrollWidth="containerScrollWidth"
      >
      </GanttThumbnail>
    </GanttNav>
  </div>
</template>

<style scoped>
strong {
  font-weight: 700;
}
.gantt-view {
  --line-height: 1.6rem;
  --cell-width: 32px;
  --cols: 20;

  display: grid;
  grid-template-columns: 300px 2fr;
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

.gantt-nav {
  grid-column: 2 / 3;
  grid-row: 999 / 1000;

  z-index: 999;
}

.before-container {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}
.gantt-container {
  grid-column: 2 / 3;
  grid-row: 2 / 3;

  overflow-x: hidden;
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
      border: 1px solid #444;
    }

    &.tiny:before {
      height: 6px;
      top: calc(50% - 3px);
      background: #444;
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
      border-bottom: 1px solid #c30;
    }

    &.tiny:before {
      height: 6px;
      top: calc(50% - 3px);
    }
  }
}
</style>
