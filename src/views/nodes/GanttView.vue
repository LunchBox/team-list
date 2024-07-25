<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import { find, focusing } from "@/stores/nodes.js";

import bus from "@/views/gantt/eventBus.js";
import useKeydownHandlers from "./useKeydownHandlers.js";

import GanttView from "@/views/gantt/GanttView.vue";
import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import DateRangeForm from "@/components/DateRangeForm.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";

const route = useRoute();
const node = computed(() => {
  return find(route.params.id);
});

const itemList = computed(() => {
  return node.value.getExpanedChildren();
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

const onItemMousedown = (...args) => bus.$emit("item-mousedown", args);
const onItemDragstart = (...args) => bus.$emit("item-dragstart", args);

useKeydownHandlers({ scopeRef: node });
</script>
<template>
  <div>
    <div v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <GanttView :list="itemList">
        <template #aside>
          <NodeList
            :list="node.children"
            :parent="node"
            :itemDraggable="true"
            @item-mousedown="onItemMousedown"
            @item-dragstart="onItemDragstart"
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
    </div>
    <div v-else>loading...</div>
  </div>
</template>
