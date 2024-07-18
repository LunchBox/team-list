<script setup>
import TaskListItem from "./TaskListItem.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

import { focusing } from "@/stores/tasks.js";

defineProps(["list", "parent"]);
</script>
<template>
  <div>
    <TaskListItem
      v-for="task in list"
      :task="task"
      :parent="parent"
    ></TaskListItem>
  </div>
</template>
