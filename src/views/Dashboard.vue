<script setup>
import { autoBind } from "@/utils/bind.js";
import {
  rootTasks,
  editing,
  focusing,
  expandAll,
  collapseAll,
  increaseIndent,
} from "@/stores/tasks.js";

import TaskDetails from "./tasks/TaskDetails.vue";
import TaskForm from "./tasks/TaskForm.vue";
import TaskList from "./tasks/TaskList.vue";

autoBind(document, "click", () => (focusing.value = null));

autoBind(document, "keydown", (e) => {
  if (!focusing.value) return;

  if (e.key === "Tab") {
    e.preventDefault();
    increaseIndent(focusing.value);
  }
});
</script>
<template>
  <div>
    <div class="flex" @click.stop>
      <div style="padding: 2rem">
        <div v-if="editing">
          <TaskForm :task="editing"></TaskForm>
        </div>
        <div v-else-if="focusing">
          <TaskDetails :task="focusing"></TaskDetails>
        </div>
      </div>
      <aside>
        <div style="margin: 1rem 0">
          Tools:
          <a href="#" @click.prevent="expandAll">Expand All</a> &middot;
          <a href="#" @click.prevent="collapseAll">Collapse All</a>
        </div>
        <TaskList :list="rootTasks"></TaskList>
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
