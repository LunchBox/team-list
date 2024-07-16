<script setup>
import TaskListItem from "./TaskListItem.vue";
import TaskForm from "./TaskForm.vue";

import { focusing } from "@/stores/tasks.js";

defineProps(["list", "parent"]);
</script>
<template>
  <ol>
    <TaskListItem
      v-for="task in list"
      :task="task"
      :parent="parent"
    ></TaskListItem>
    <li v-if="focusing === parent">
      <TaskForm :parent="parent"></TaskForm>
    </li>
  </ol>
</template>
