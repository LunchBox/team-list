<script setup>
import TaskListItem from "./TaskListItem.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

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
    <li v-if="(!focusing && !parent) || focusing === parent">
      <TaskInlineForm :parent="parent"></TaskInlineForm>
    </li>
  </ol>
</template>
