<script setup>
import { ref, watch } from "vue";

import { Task, editing, focusing } from "@/stores/tasks.js";

const props = defineProps(["task", "parent"]);

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
  const ut = formData.value.save();
  reloadForm();

  editing.value = null;
  focusing.value = ut;
};
</script>
<template>
  <form @submit.prevent="onSubmit">
    <label>
      <span>Title</span>
      <input type="text" v-model="formData.title" />
    </label>
    <label>
      <span>Content</span>
      <textarea v-model="formData.content"></textarea>
    </label>
    <input type="submit" value="Submit" />
    <input type="button" value="reset" @click.prevent="reloadForm" />
    <input type="button" value="cancel" @click.prevent="editing = null" />
  </form>
</template>

<style scoped>
label {
  display: block;
  margin: 0.5rem 0;
}
label > span {
  display: block;
}

input[type="text"] {
  width: 100%;
}
textarea {
  width: 100%;
  height: 12rem;
}
</style>
