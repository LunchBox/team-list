<script setup>
import { ref, watch } from "vue";

import randomId from "@/utils/random_id.js";

class Task {
  user = null;
  content = null;
  children = [];
}

const taskList = ref([]);
const currentUser = ref("daniel");

watch(
  taskList,
  () => {
    localStorage.setItem("tl-data", JSON.stringify(taskList.value));
  },
  { deep: true }
);
const load = () => {
  const ds = localStorage.getItem("tl-data");
  if (typeof ds === "string") {
    taskList.value = JSON.parse(ds).map((str) =>
      Object.assign(new Task(), str)
    );
  }
};
load();

const formData = ref(new Task());

const onSubmit = () => {
  const task = formData.value;
  task.user = currentUser.value;

  if (!task.id) {
    task.id = randomId();
    taskList.value.unshift(task);
  }

  formData.value = new Task();
};

const edit = (task) => {
  formData.value = task;
};
</script>
<template>
  <div>
    <div style="margin: 2rem 0">
      <form @submit.prevent="onSubmit">
        <input type="text" v-model="formData.content" />
        <input type="hidden" v-model="formData.user" />
        <input type="submit" value="Submit" />
      </form>
    </div>
    <div>
      <ul>
        <li v-for="task in taskList" @click.prevent="edit(task)">
          {{ task.content }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-top: 1rem;
}
li {
  margin: 0.5rem 0;
}
</style>
