<script setup>
import {
  focusing,
  editing,
  countChildren,
  getChildren,
} from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";

const props = defineProps(["task", "parent"]);
</script>
<template>
  <li :class="{ active: focusing === task }">
    <div class="item-main">
      <a href="#" @click.prevent="task.expend = !task.expend">
        {{ task.expend ? "-" : "+" }}
      </a>

      <a href="#" @click.prevent="focusing = task" @dblclick="editing = task">
        {{ task.title }}
      </a>

      <span style="color: #ccc; font-style: italic; font-size: smaller">
        ({{ getChildren(task).length }} : {{ countChildren(task) }})
      </span>

      <span style="color: #ccc; font-style: italic"> - {{ task.user }} </span>
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
li.active > .item-main:after {
  content: "<--";
  margin-left: 0.5rem;
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
