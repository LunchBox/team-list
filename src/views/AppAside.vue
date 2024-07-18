<script setup>
import { useRouter } from "vue-router";
import { autoBind } from "@/utils/bind.js";
import {
  rootTasks,
  focusing,
  expandAll,
  collapseAll,
  resetTaskList,
} from "@/stores/tasks.js";
import useKeydownHandlers from "./tasks/keydown_handlers.js";

import TaskList from "./tasks/TaskList.vue";
import TaskInlineForm from "./tasks/TaskInlineForm.vue";

// 點在畫面上其他地方都 release focus
autoBind(document, "click", () => (focusing.value = null));

useKeydownHandlers();

const clear = () => {
  if (!confirm("Are you sure?")) return;
  resetTaskList();
};

const router = useRouter();
const onClick = (task) => {
  router.push({ path: `/nodes/${task.id}` });
  focusing.value = task;
};
</script>
<template>
  <aside>
    <div style="margin: 1rem 0">
      Tools:
      <a href="#" @click.prevent="expandAll">Expand All</a> &middot;
      <a href="#" @click.prevent="collapseAll">Collapse All</a> &middot;
      <a href="#" @click.prevent="clear">Delete All</a>
    </div>
    <div class="item-list">
      <TaskList :list="rootTasks" @click="onClick"></TaskList>
      <div class="list-item">
        <div class="list-item-row flex items-center">
          <span class="list-item-marker">-</span>
          <TaskInlineForm class="cell full"></TaskInlineForm>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.flex {
  display: flex;
}

aside {
  flex: 0 0 30%;
  padding: 0 1rem;
}

/* customize the list position */
.item-list {
  margin-left: -2rem;
}
</style>
