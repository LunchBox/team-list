<script setup>
import { ref, watch } from "vue";

import { save } from "@/stores/tasks.js";
import Task from "@/models/task.js";

const props = defineProps(["task", "parent"]);

const formData = ref(new Task());

watch(
  () => props.task,
  () => {
    if (props.task instanceof Task) {
      // do not touch the children at the moment
      const { children, ...attrs } = props.task;
      formData.value = attrs;
    }
  },
  {
    immediate: true,
  }
);

const reset = () => {
  formData.value = new Task();
};

const onSubmit = () => {
  save(formData.value, props.parent);

  reset();
};
</script>
<template>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="formData.content" />
    <input type="submit" value="Submit" />
    <input type="button" value="reset" @click.prevent="reset" />
  </form>
</template>
