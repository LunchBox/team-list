<script setup>
import { ref } from "vue";
import TaskListItem from "./TaskListItem.vue";

defineProps(["list", "parent"]);
defineEmits(["click", "dblclick"]);

const apx = ref(null);
</script>
<template>
  <div class="a-list">
    <TaskListItem
      v-for="task in list"
      :task="task"
      :parent="parent"
      :appending="apx === task"
      @click="(task) => $emit('click', task)"
      @dblclick="(task) => $emit('dblclick', task)"
      @appending="(task) => (apx = task)"
    ></TaskListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
