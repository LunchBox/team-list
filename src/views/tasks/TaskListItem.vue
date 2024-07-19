<script setup>
import { ref } from "vue";
import { focusing } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

const props = defineProps(["task", "parent", "appending"]);
const emit = defineEmits(["click", "dblclick", "appending"]);

const quickEdit = ref(false);
//TODO: click within  0.5s and < 1s should activate quick edit mode
</script>
<template>
  <div
    v-bind="$attrs"
    class="list-item"
    tabindex="0"
    :class="{ active: focusing === task }"
  >
    <TaskInlineForm
      v-if="quickEdit"
      :task="task"
      @after-submit="quickEdit = false"
    ></TaskInlineForm>

    <div
      v-else
      class="list-item-row flex items-center"
      tabindex="0"
      @keydown.enter.prevent="$emit('appending', task)"
    >
      <template v-if="task.isContentBlank && task.isChildrenBlank">
        <span class="list-item-marker">-</span>
        <span
          class="full"
          @click.prevent="$emit('click', task)"
          @dblclick="$emit('dblclick', task)"
          style="padding: 3px"
        >
          {{ task.title }}
        </span>
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
  <!-- insert contents -->
  <TaskInlineForm
    v-if="appending"
    :parent="task.parent"
    :seq="task.seq"
    @after-submit="(t) => $emit('appending', t)"
  ></TaskInlineForm>
</template>

<style scoped>
.list-item-row {
  outline: none;
}
</style>
