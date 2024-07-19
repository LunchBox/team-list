<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { focusing, destroy } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

import { jsondata } from "./sample.js";

const props = defineProps(["task", "parent"]);

const router = useRouter();
const onDblClick = (task) => {
  router.push({ path: `/nodes/${task.id}` });
  focusing.value = task;
};

const onDelete = () => {
  const task = props.task;
  const parent = task.parent;
  destroy(task);

  if (parent) {
    router.push({ path: `/nodes/${parent.id}` });
  }
};

const appendingTo = ref(null);
const onEnter = (task) => {
  console.log("------- hh", task);
};

const onKeydown = () => {
  console.log("-- on key down");
};
</script>
<template>
  <div>
    <h2>{{ task.title }}</h2>
    <div style="margin: 1rem 0">
      <RouterLink :to="`/nodes/${task.id}/edit`">Edit</RouterLink> &middot;

      <a href="#" @click="onDelete">Delete</a>
    </div>

    <div v-if="!task.isContentBlank" class="content">
      {{ task.content }}
    </div>

    <TaskList
      :list="task.children"
      :parent="task"
      :appendable="true"
      @click="(task) => (focusing = task)"
      @dblclick="onDblClick"
    >
      <TaskInlineForm :parent="task"></TaskInlineForm>
    </TaskList>

    <template v-if="false">
      <div>This is a testing of a vue excel editor</div>
      <vue-excel-editor v-model="jsondata" filter-row />
    </template>
  </div>
</template>

<style scoped>
.content {
  background: #efefef;
  padding: 0.5rem;
  margin-bottom: 1rem;
  white-space: pre;
}
</style>
