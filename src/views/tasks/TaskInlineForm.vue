<script setup>
import { ref, watch } from "vue";

import { Task } from "@/stores/tasks.js";

const props = defineProps(["task", "parent"]);
const emit = defineEmits(["after-submit"]);

const formData = ref(null);

const reloadForm = () => {
  formData.value = Object.assign(new Task(), { ...props.task });

  if (props.parent) {
    formData.value.parentId = props.parent?.id;
  }
};

watch(props, reloadForm, {
  immediate: true,
});

const onSubmit = () => {
  formData.value.save();
  reloadForm();

  emit("after-submit");
};
</script>
<template>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="formData.title" autofocus required />
    <input type="submit" value="Submit" />
    <input type="button" value="reset" @click.prevent="reloadForm" />
  </form>
</template>
