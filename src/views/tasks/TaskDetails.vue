<script setup>
import { useRouter } from "vue-router";
import { focusing, destroy } from "@/stores/tasks.js";

import TaskList from "./TaskList.vue";
import TaskInlineForm from "./TaskInlineForm.vue";

import { jsondata } from "./sample.js";

defineProps(["task", "parent"]);

const router = useRouter();
const onDblClick = (task) => {
  router.push({ path: `/nodes/${task.id}` });
  focusing.value = task;
};
</script>
<template>
  <div>
    <h2>{{ task.title }}</h2>
    <div style="margin: 1rem 0">
      <RouterLink :to="`/nodes/${task.id}/edit`">Edit</RouterLink> &middot;

      <a href="#" @click="destroy(task)">Delete</a>
    </div>

    <div v-if="!task.isContentBlank" class="content">
      {{ task.content }}
    </div>

    <TaskList
      :list="task.children"
      :parent="task"
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
