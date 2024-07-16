<script setup>
import { editing, focusing, destroy } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";

const props = defineProps(["task", "parent"]);

const onClick = () => {
  const { task } = props;
  editing.value = task;

  task.expend = !task.expend;
  if (task.expend) {
    focusing.value = task;
  }
};
</script>
<template>
  <li>
    <div class="item-main">
      <a href="#" @click.prevent="onClick">
        {{ task.expend ? "-" : "+" }}
        {{ task.content }}
      </a>

      <span style="color: #ccc; font-style: italic; font-size: smaller">
        ({{ task.children?.length }} : {{ task.countAll() }})
      </span>

      <span style="color: #ccc; font-style: italic"> - {{ task.user }} </span>

      <span class="del">
        -
        <a href="#" @click="destroy(task, parent)">Delete</a>
      </span>
    </div>
    <div v-if="task.expend">
      <TaskList :list="task.children" :parent="task"></TaskList>
    </div>
  </li>
</template>

<style scoped>
li {
  margin: 4px 0;
}
.del {
  color: #ccc;
  font-style: italic;
}

li .del {
  display: none;
}
li:hover > .item-main .del {
  display: initial;
}
</style>
