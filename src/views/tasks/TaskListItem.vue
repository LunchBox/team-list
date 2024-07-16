<script setup>
import {
  focusing,
  destroy,
  countChildren,
  getChildren,
} from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";

const props = defineProps(["task", "parent"]);

const onClick = () => {
  const { task } = props;
  focusing.value = task;
};
</script>
<template>
  <li>
    <div class="item-main">
      <a href="#" @click.prevent="task.expend = !task.expend">
        {{ task.expend ? "-" : "+" }}
      </a>

      <a href="#" @click.prevent="onClick">
        {{ task.title }}
      </a>

      <span style="color: #ccc; font-style: italic; font-size: smaller">
        ({{ getChildren(task).length }} : {{ countChildren(task) }})
      </span>

      <span style="color: #ccc; font-style: italic"> - {{ task.user }} </span>

      <span class="del">
        -
        <a href="#" @click="destroy(task)">Delete</a>
      </span>
    </div>
    <div v-if="task.expend">
      <TaskList :list="getChildren(task)" :parent="task"></TaskList>
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
