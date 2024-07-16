<script setup>
import { onUnmounted } from "vue";
import {
  taskList,
  editing,
  focusing,
  expandAll,
  collapseAll,
} from "@/stores/tasks.js";

import TaskForm from "./tasks/TaskForm.vue";
import TaskList from "./tasks/TaskList.vue";

import {} from "@/stores/tasks.js";

const clearFocus = () => (focusing.value = null);
document.addEventListener("click", clearFocus);
onUnmounted(() => {
  document.removeEventListener("click", clearFocus);
});
</script>
<template>
  <div>
    <div class="flex">
      <div>
        <TaskForm v-if="editing" :task="editing"></TaskForm>
      </div>
      <aside @click.stop>
        <div style="margin: 1rem 0">
          Tools:
          <a href="#" @click.prevent="expandAll">Expand All</a> &middot;
          <a href="#" @click.prevent="collapseAll">Collapse All</a>
        </div>
        <TaskList :list="taskList"></TaskList>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.flex > * {
  flex: 1;
}
</style>
