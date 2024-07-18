<script setup>
import { nextTick, ref, watch } from "vue";

import { Task } from "@/stores/tasks.js";
import resize from "@/utils/resizeable.js";

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

  // have to wait for the new content to be loaded
  nextTick(() => {
    resizeTextarea();
  });

  emit("after-submit");
};

const textEl = ref(null);
const resizeTextarea = () => {
  textEl.value && resize(textEl.value);
};
</script>
<template>
  <div class="list-item">
    <div class="list-item-row flex items-center">
      <span class="list-item-marker">-</span>

      <form class="full" @submit.prevent="onSubmit" @keydown.stop>
        <textarea
          ref="textEl"
          rows="1"
          autofocus
          required
          placeholder="what's on your mind?"
          v-model="formData.title"
          @input="resizeTextarea"
          @keydown.enter.prevent="onSubmit"
        ></textarea>
        <input type="submit" value="Submit" />
      </form>
    </div>
  </div>
</template>

<style scoped>
textarea {
  flex: 1;
  line-height: 1.5rem;
  border: none;
  outline: none;

  font-family: var(--base-font-family);
  font-size: var(--base-font-size);
  color: var(--color-text);

  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 0 3px;
  resize: none;
}

::placeholder {
  color: #ddd;
}

input[type="submit"] {
  background: #ddd;
  border: none;
  border-radius: 2px;
  display: none;
}
</style>
