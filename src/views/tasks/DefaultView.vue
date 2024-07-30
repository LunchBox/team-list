<script setup>
import { computed, toValue, provide } from "vue";
import { useRoute } from "vue-router";

import useSelection from "@/utils/useSelection.js";

import Task from "@/stores/task.js";

import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";

import EditableList from "./EditableList.vue";

const selection = useSelection();

const route = useRoute();
const item = computed(() => Task.find(route.params.id));

const convertTo = (contentType = null) => {
  const items = toValue(selection.selectedItems);
  items.forEach((n) => (n.contentType = contentType));
};

provide("project", () => item.value.project);
</script>
<template>
  <div>
    <template v-if="item">
      <Breadcrumbs :item="item"></Breadcrumbs>
      <Header :item="item"></Header>

      <div style="padding-bottom: 80vh">
        <EditableList
          :parent="item"
          :list="item.children"
          :selection="selection"
        ></EditableList>
      </div>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
