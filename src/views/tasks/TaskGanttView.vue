<script setup>
import { computed, provide, toValue } from "vue";
import { useRoute } from "vue-router";

import Task from "@/stores/task.js";

import useSelection from "@/utils/useSelection.js";

import GanttView from "@/views/gantt/GanttView.vue";

import DateRangeForm from "@/components/DateRangeForm.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

import TaskGanttHeader from "./TaskGanttHeader.vue";
import EditableList from "./EditableList.vue";

const route = useRoute();
const item = computed(() => Task.find(route.params.id));

const itemList = computed(() => {
  return item.value.expandedChildren;
});

const selection = useSelection();
provide("selection", selection);

const { selectedItems } = selection;

const theOnlyFirstItem = computed(() => {
  const items = toValue(selectedItems);

  return items.length === 1 ? items.first : null;
});

const onDateChanged = (formData) => {
  if (!theOnlyFirstItem.value) return;

  const { start_date, end_date } = formData;
  const item = theOnlyFirstItem.value;

  item.start_date = start_date;
  item.end_date = end_date;
};

const dateRange = computed(() => {
  if (!theOnlyFirstItem.value) return;

  const { start_date, end_date } = theOnlyFirstItem.value;
  return {
    start_date,
    end_date,
  };
});
</script>
<template>
  <div>
    <div v-if="item">
      <Breadcrumbs :item="item"></Breadcrumbs>
      <TaskGanttHeader :item="item"></TaskGanttHeader>

      <GanttView :list="itemList">
        <template #aside>
          <EditableList
            :parent="item"
            :list="item.children"
            :item-draggable="true"
          ></EditableList>
        </template>

        <template #before-container>
          <DateRangeForm
            :date_range="dateRange"
            @submit="onDateChanged"
          ></DateRangeForm>
        </template>
      </GanttView>
    </div>
    <div v-else>loading...</div>
  </div>
</template>
