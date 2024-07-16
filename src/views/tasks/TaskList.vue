<script setup>
import TaskListItem from "./TaskListItem.vue";
import TaskForm from "./TaskForm.vue";

defineProps(["list", "parent"]);
</script>
<template>
  <ul>
    <TaskListItem
      v-for="task in list"
      :task="task"
      :parent="parent"
    ></TaskListItem>
    <li>
      <TaskForm :parent="parent"></TaskForm>
    </li>
  </ul>
</template>
