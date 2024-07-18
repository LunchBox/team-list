<script setup>
import TaskListItem from "./TaskListItem.vue";

defineProps(["list", "parent"]);
defineEmits(["click", "dblclick"]);
</script>
<template>
  <div class="a-list">
    <TaskListItem
      v-for="task in list"
      :task="task"
      :parent="parent"
      @click="(task) => $emit('click', task)"
      @dblclick="(task) => $emit('dblclick', task)"
    ></TaskListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
