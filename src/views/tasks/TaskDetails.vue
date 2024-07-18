<script setup>
import { useRouter } from "vue-router";
import { focusing, editing, destroy } from "@/stores/tasks.js";

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
      <a href="#" @click.prevent="editing = task">Edit</a> &middot;

      <a href="#" @click="destroy(task)">Delete</a>
    </div>

    <div class="content">
      {{ task.content }}
    </div>

    <div class="list">
      <TaskList
        :list="task.children"
        :parent="task"
        @click="(task) => (focusing = task)"
        @dblclick="onDblClick"
      ></TaskList>

      <div class="list-item">
        <TaskInlineForm :parent="task"></TaskInlineForm>
      </div>
    </div>

    <template v-if="false">
      <div>This is a testing of a vue excel editor</div>
      <vue-excel-editor v-model="jsondata" filter-row />
    </template>
  </div>
</template>

<style scoped>
.content {
  white-space: pre;
}
</style>
