<script setup>
import { autoBind } from "@/utils/bind.js";
import {
  rootTasks,
  editing,
  focusing,
  expandAll,
  collapseAll,
  increaseIndent,
  decreaseIndent,
  moveUp,
  moveDown,
} from "@/stores/tasks.js";

import TaskDetails from "./tasks/TaskDetails.vue";
import TaskForm from "./tasks/TaskForm.vue";
import TaskList from "./tasks/TaskList.vue";

autoBind(document, "click", () => (focusing.value = null));

autoBind(document, "keydown", (e) => {
  if (!focusing.value) return;

  if (e.key === "Tab") {
    e.preventDefault();

    if (e.shiftKey) {
      decreaseIndent(focusing.value);
    } else {
      increaseIndent(focusing.value);
    }
  }

  const ft = focusing.value;
  if (!ft) return;

  // 按住 shift 移動
  if (e.shiftKey) {
    e.preventDefault();

    if (e.key === "ArrowUp") {
      moveUp(focusing.value);
    } else if (e.key === "ArrowDown") {
      moveDown(focusing.value);
    }
  } else {
    // 不按 shift 只是移動 focus
    const fs = {
      ArrowUp: () => {
        return (
          (ft.prev && ft.prev.exp && ft.prev.children.last) ||
          ft.prev ||
          ft.parent
        );
      },
      ArrowDown: () => {
        return (ft.exp && ft.children.first) || ft.next || ft.parent?.next;
      },
      ArrowLeft: () => {
        if (focusing.value.exp) {
          focusing.value.collapse();
        } else {
          return ft.parent;
        }
      },
      ArrowRight: () => {
        focusing.value.expand();
      },
    };

    const target = fs[e.key]?.();
    target && (focusing.value = target);
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
