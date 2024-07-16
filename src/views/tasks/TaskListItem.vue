<script setup>
import { focusing, editing } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";

const props = defineProps(["task", "parent"]);
</script>
<template>
  <li :class="{ active: focusing === task }">
    <div class="item-main">
      <a href="#" @click.prevent="task.exp = !task.exp">
        {{ task.exp ? "-" : "+" }}
      </a>

      <a href="#" @click.prevent="focusing = task" @dblclick="editing = task">
        {{ task.title }}
      </a>

      <span style="color: #ccc; font-style: italic; font-size: smaller">
        ({{ task.children.length }} : {{ task.allChildrenLen }})
      </span>

      <span style="color: #ccc; font-style: italic"> - {{ task.user }} </span>
    </div>
    <div v-if="task.exp">
      <TaskList :list="task.children" :parent="task"></TaskList>
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
