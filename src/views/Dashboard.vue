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
  resetTaskList,
} from "@/stores/tasks.js";

import TaskDetails from "./tasks/TaskDetails.vue";
import TaskList from "./tasks/TaskList.vue";
import TaskForm from "./tasks/TaskForm.vue";
import TaskInlineForm from "./tasks/TaskInlineForm.vue";

// 點在畫面上其他地方都 release focus
autoBind(document, "click", () => (focusing.value = null));

autoBind(document, "keydown", (e) => {
  if (!focusing.value) return;
  const ft = focusing.value;

  // 按住 shift 移動
  if (e.shiftKey) {
    e.preventDefault();

    const fs = {
      ArrowUp: () => moveUp(ft),
      ArrowDown: () => moveDown(ft),
      ArrowLeft: () => decreaseIndent(ft),
      ArrowRight: () => increaseIndent(ft),
    };

    fs[e.key]?.();
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

const clear = () => {
  if (!confirm("Are you sure?")) return;
  resetTaskList();
};
</script>
<template>
  <div>
    <div class="flex" @click.stop>
      <aside>
        <div style="margin: 1rem 0">
          Tools:
          <a href="#" @click.prevent="expandAll">Expand All</a> &middot;
          <a href="#" @click.prevent="collapseAll">Collapse All</a> &middot;
          <a href="#" @click.prevent="clear">Delete All</a>
        </div>
        <div class="list">
          <TaskList :list="rootTasks"></TaskList>
          <div class="list-item">
            <TaskInlineForm></TaskInlineForm>
          </div>
        </div>
      </aside>
      <main>
        <div v-if="editing">
          <TaskForm :task="editing"></TaskForm>
        </div>
        <div v-else-if="focusing">
          <TaskDetails :task="focusing"></TaskDetails>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

aside {
  flex: 0 0 30%;
  padding: 1rem;
}

main {
  flex: 1;
  padding: 1rem;
  min-height: 80vh;
  border-left: 2px solid #f0f0f0;
}

:deep(.list-item) {
  margin: 4px 0;
  padding-left: 1rem;
}
</style>
