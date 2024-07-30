<script setup>
import { computed, provide } from "vue";
import { useRouter } from "vue-router";

import useSelection from "@/utils/useSelection.js";

import EditableList from "./EditableList.vue";

import Task from "@/stores/task.js";

const list = computed(() => Task.topTasks);

const router = useRouter();
const onItemClick = (e, item) => {
  router.push({ name: "task", params: { id: item.id } });
};

const selection = useSelection();
provide("selection", selection);
</script>
<template>
  <div>
    <EditableList :list="list" @item-clicked="onItemClick"></EditableList>
  </div>
</template>

<style scoped></style>
