<script setup>
import { useRouter } from "vue-router";
import { rootNodes } from "@/stores/nodes.js";

import useSelection from "@/utils/useSelection.js";

import Project from "@/stores/project.js";
import Task from "@/stores/task.js";

const router = useRouter();
const onItemClick = (e, node) => {
  router.push({ name: "node", params: { id: node.id } });
};

const selection = useSelection();
</script>
<template>
  <div>Project List</div>
</template>

<style scoped></style>
