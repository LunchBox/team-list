<script setup>
import { ref } from "vue";
import { focusing } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

const props = defineProps(["task", "parent"]);

const quickEdit = ref(false);
</script>
<template>
  <div class="list-item" :class="{ active: focusing === task }">
    <TaskInlineForm
      v-if="quickEdit"
      :task="task"
      @after-submit="quickEdit = false"
    ></TaskInlineForm>

    <div class="item-summary" v-else>
      <a href="#" @click.prevent="task.exp = !task.exp">
        {{ task.exp ? "-" : "+" }}
      </a>

      <a href="#" @click.prevent="focusing = task" @dblclick="quickEdit = true">
        {{ task.title }}
      </a>

      <span style="color: #ccc; font-style: italic; font-size: smaller">
        ({{ task.children.length }} : {{ task.allChildrenLen }})
      </span>
    </div>

    <div v-if="task.exp">
      <TaskList :list="task.children" :parent="task"></TaskList>
    </div>
  </div>
</template>

<style scoped>
.list-item.active > .item-summary:after {
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
li:hover > .item-summary .del {
  display: initial;
}
</style>
