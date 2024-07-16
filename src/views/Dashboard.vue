<script setup>
import { taskList, editing, save } from "@/stores/tasks.js";

import TaskForm from "./tasks/TaskForm.vue";
import TaskList from "./tasks/TaskList.vue";

const reset = () => {
  editing.value = null;
};
</script>
<template>
  <div>
    <div style="margin: 2rem 0">
      <TaskForm :task="editing"></TaskForm>
    </div>
    <div>
      <TaskList :list="taskList"></TaskList>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-top: 1rem;
}
li {
  margin: 0.5rem 0;
}
</style>
