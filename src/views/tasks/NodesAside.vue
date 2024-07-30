<script setup>
import { useRouter } from "vue-router";
import { rootNodes } from "@/stores/nodes.js";

import useSelection from "@/utils/useSelection.js";

import EditableNodeList from "./EditableNodeList.vue";

import Project from "@/stores/project.js";
import Task from "@/stores/task.js";

console.log(Project);
console.log(Task);

const router = useRouter();
const onItemClick = (e, node) => {
  router.push({ name: "node", params: { id: node.id } });
};

const selection = useSelection();
</script>
<template>
  <div>
    <EditableNodeList
      :list="rootNodes"
      :selection="selection"
      @item-clicked="onItemClick"
    ></EditableNodeList>
  </div>
</template>

<style scoped></style>
