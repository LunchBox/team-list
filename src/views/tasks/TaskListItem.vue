<script setup>
import { ref } from "vue";
import { focusing } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

const props = defineProps(["task", "parent"]);
defineEmits(["click", "dblclick"]);

const quickEdit = ref(false);
//TODO: click within  0.5s and < 1s should activate quick edit mode
</script>
<template>
  <div class="list-item" :class="{ active: focusing === task }">
    <TaskInlineForm
      v-if="quickEdit"
      :task="task"
      @after-submit="quickEdit = false"
    ></TaskInlineForm>

    <div v-else class="item-summary">
      <a href="#" @click.prevent="task.exp = !task.exp">
        {{ task.exp ? "-" : "+" }}
      </a>

      <a
        href="#"
        @click.prevent="$emit('click', task)"
        @dblclick="$emit('dblclick', task)"
      >
        {{ task.title }}
      </a>

      <span style="color: #ccc; font-style: italic; font-size: smaller">
        ({{ task.children.length }} : {{ task.allChildrenLen }})
      </span>
    </div>

    <div v-if="task.exp">
      <TaskList
        :list="task.children"
        :parent="task"
        @click="(item) => $emit('click', item)"
      ></TaskList>
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
