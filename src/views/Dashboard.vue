<script setup>
import { ref, watch } from "vue";

class Task {
  user = "daniel";
  content = null;
}

const taskList = ref([]);

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
  taskList.value.push(formData.value);
  formData.value = new Task();
};
</script>
<template>
  <div>
    <h2>Dashboard</h2>
    <div>
      <form @submit.prevent="onSubmit">
        <input type="text" v-model="formData.content" />
        <input type="hidden" v-model="formData.user" />
        <input type="submit" value="Submit" />
      </form>
    </div>
    <div>
      <h2>Task List</h2>
      <ul>
        <li v-for="task in taskList">{{ task.user }}: {{ task.content }}</li>
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
