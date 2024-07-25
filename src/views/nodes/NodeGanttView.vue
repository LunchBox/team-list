<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import { find } from "@/stores/nodes.js";

import useSelection from "@/utils/useSelection.js";

import GanttView from "@/views/gantt/GanttView.vue";

import DateRangeForm from "@/components/DateRangeForm.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";
import EditableNodeList from "./EditableNodeList.vue";

const route = useRoute();
const node = computed(() => {
  return find(route.params.id);
});

const itemList = computed(() => {
  return node.value.getExpanedChildren();
});

const selection = useSelection();

const theOnlyFirstItem = computed(() => {
  return selection.selectedItems.value.length === 1
    ? selection.first.value
    : null;
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
    <div v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <GanttView :list="itemList" :selection="selection">
        <template #aside>
          <EditableNodeList
            :node="node"
            :selection="selection"
            :itemDraggable="true"
          ></EditableNodeList>
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
