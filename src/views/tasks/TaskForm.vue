<script setup>
import { ref, watch } from "vue";

import { save } from "@/stores/tasks.js";

const props = defineProps(["task", "parent"]);

const formData = ref(null);

const reset = () => {
  if (props.task) {
    formData.value = { ...props.task };
  } else {
    formData.value = { title: null, content: null };
  }
  if (props.parent) {
    formData.value.parentId = props.parent?.id;
  }
};

watch(props, reset, {
  immediate: true,
});

const onSubmit = () => {
  save(formData.value);

  reset();
};
</script>
<template>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="formData.title" />
    <input type="submit" value="Submit" />
    <input type="button" value="reset" @click.prevent="reset" />
  </form>
</template>
