<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import Project from "@/stores/project.js";

const props = defineProps(["project"]);

const formData = ref(null);

const reloadForm = () => {
  formData.value = Object.assign(new Project(), { ...props.project });
};

watch(props, reloadForm, {
  immediate: true,
});

const router = useRouter();
const backToShow = () => {
  router.push({ name: "project", id: props.project.id });
};

const onSubmit = () => {
  formData.value.save();

  backToShow();
};

const onCancel = backToShow;
</script>
<template>
  <form @submit.prevent="onSubmit" @keydown.stop>
    <label>
      <span>Name</span>
      <input type="text" v-model="formData.name" />
    </label>
    <input type="submit" value="Submit" />
    <input type="button" value="reset" @click.prevent="reloadForm" />
    <input type="button" value="cancel" @click.prevent="onCancel" />
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

label.flex {
  display: flex;
  align-items: center;
  gap: 0 0.5rem;
}

input[type="text"] {
  width: 100%;
}
textarea {
  width: 100%;
  height: 12rem;
}
</style>
