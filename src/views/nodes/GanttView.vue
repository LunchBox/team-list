<script setup>
import { computed } from "vue";
import GanttView from "@/views/gantt/GanttView.vue";
import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import { focusing } from "@/stores/nodes.js";
import DateRangeForm from "@/components/DateRangeForm.vue";

const props = defineProps(["node"]);

const itemList = computed(() => {
  return props.node.getExpanedChildren();
});

const onDateChanged = (formData) => {
  if (!focusing.value) return;

  const { start_date, end_date } = formData;
  const item = focusing.value;
  item.start_date = start_date;
  item.end_date = end_date;
};

const dateRange = computed(() => {
  if (!focusing.value) return;

  const { start_date, end_date } = focusing.value;
  return {
    start_date,
    end_date,
  };
});
</script>
<template>
  <GanttView :list="itemList">
    <template #aside>
      <NodeList
        :list="node.children"
        :parent="node"
        :appendable="true"
        @click="(node) => (focusing = node)"
      >
        <InlineForm :parent="node"></InlineForm>
      </NodeList>
    </template>

    <template #before-container>
      <DateRangeForm
        :date_range="dateRange"
        @submit="onDateChanged"
      ></DateRangeForm>
    </template>
  </GanttView>
</template>
