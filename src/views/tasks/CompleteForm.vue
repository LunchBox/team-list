<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

import Task from "@/stores/task.js";

const props = defineProps(["item", "parent"]);

const formData = ref(null);

const reloadForm = () => {
  formData.value = Object.assign(new Task(), { ...props.item });

  if (props.parent) {
    formData.value.parentId = props.parent?.id;
  }
};

watch(props, reloadForm, {
  immediate: true,
});

const router = useRouter();
const backToShow = () => {
  router.push({ name: "task", params: { id: props.item?.id } });
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
    <label>
      <span>Content</span>
      <textarea v-model="formData.content"></textarea>
    </label>
    <label>
      <span>Start Date</span>
      <input type="date" v-model="formData.start_date" />
    </label>
    <label>
      <span>End Date</span>
      <input type="date" v-model="formData.end_date" />
    </label>
    <label class="flex">
      <input type="checkbox" v-model="formData.noDateDrag" />
      <span>Not allow drag & drop to adjust the start & end date</span>
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
