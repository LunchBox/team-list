<script setup>
import { ref, watch } from "vue";

import { editing } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";

const props = defineProps(["task"]);
defineEmits(["select", "reset", "submit-child"]);

const onClick = () => {
  editing.value = props.task;
  props.task.expend = !props.task.expend;
};
</script>
<template>
  <li>
    <div>
      <a href="#" @click.prevent="onClick">
        {{ task.expend ? "-" : "+" }}
        {{ task.content }}
      </a>

      <span style="color: #999">({{ task.children?.length }})</span>
    </div>
    <div v-if="task.expend">
      <TaskList :list="task.children" :parent="task"></TaskList>
    </div>
  </li>
</template>
