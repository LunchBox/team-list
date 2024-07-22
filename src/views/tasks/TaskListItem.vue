<script setup>
import { focusing, appendMode, quickEdit } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

import MarkedText from "@/components/MarkedText.vue";

const props = defineProps(["task", "parent", "appendable"]);
const emit = defineEmits(["click", "dblclick"]);

defineOptions({
  inheritAttrs: false,
});
</script>
<template>
  <!-- editing mode -->
  <TaskInlineForm
    v-if="quickEdit && focusing === task"
    :task="task"
    style="border: 1px solid #ccc"
    @after-submit="quickEdit = false"
  ></TaskInlineForm>
  <!-- display mode -->
  <div
    v-else
    v-bind="$attrs"
    class="list-item"
    :class="{ active: focusing === task }"
  >
    <div class="list-item-row flex items-center">
      <RouterLink :to="`/nodes/${task.id}`" class="list-item-cell">
        <img src="@/assets/arrow-right.svg" alt="focus" class="focus-marker" />
      </RouterLink>
      <template v-if="task.isContentBlank && task.isChildrenBlank">
        <span class="list-item-marker">-</span>

        <MarkedText
          :text="task.title"
          class="full"
          @click.prevent="$emit('click', task)"
          @dblclick="$emit('dblclick', task)"
        ></MarkedText>
      </template>
      <template v-else>
        <a
          href="#"
          class="list-item-marker"
          @click.prevent="task.exp = !task.exp"
        >
          {{ task.exp ? "-" : "+" }}
        </a>
        <a
          href="#"
          class="full"
          @click.prevent="$emit('click', task)"
          @dblclick="$emit('dblclick', task)"
        >
          {{ task.title }}
        </a>
        <span style="color: #ccc; font-style: italic; font-size: smaller">
          ({{ task.children.length }} : {{ task.allChildrenLen }})
        </span>
      </template>
      <span style="font-size: smaller; color: #ccc; padding: 0 0.5rem">{{
        task.seq
      }}</span>
    </div>

    <TaskList
      v-if="task.exp"
      :list="task.children"
      :parent="task"
      @click="(task) => $emit('click', task)"
      @dblclick="(task) => $emit('dblclick', task)"
    ></TaskList>
  </div>
  <!-- appending mode, append contents after focusing item -->
  <TaskInlineForm
    v-if="appendable && appendMode && focusing === task"
    :parent="focusing.parent"
    :seq="focusing.seq"
  ></TaskInlineForm>
</template>

<style scoped>
.list-item-row {
  outline: none;
}
</style>
