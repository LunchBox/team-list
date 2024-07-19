<script setup>
import TaskListItem from "./TaskListItem.vue";

defineProps(["list", "parent", "appendable"]);
defineEmits(["click", "dblclick"]);
</script>
<template>
  <div class="a-list">
    <TaskListItem
      v-for="task in list"
      :task="task"
      :parent="parent"
      :appendable="appendable"
      @click="(task) => $emit('click', task)"
      @dblclick="(task) => $emit('dblclick', task)"
    ></TaskListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
