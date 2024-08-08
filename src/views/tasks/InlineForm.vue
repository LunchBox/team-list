<script setup>
import { nextTick, ref, watch } from "vue";

import { createTask, fetchTasks, fetchTask } from "@/api/tasks";

import Task from "@/stores/task.js";

import resize from "@/utils/resizeable.js";

const props = defineProps(["item", "parent", "seq", "autofocus"]);
const emit = defineEmits(["after-submit", "cancel"]);

const formData = ref(null);

const reloadForm = () => {
  const task = Object.assign(new Task(), { ...props.item });

  if (props.parent) {
    task.parentId = props.parent?.id;
  }

  task.seq =
    (props.item?.id && props.item?.seq) ??
    (props.seq ?? props.parent?.maxChildSeq ?? task.maxSiblingSeq ?? -1) + 1;

  formData.value = task;
};

fetchTasks().then((tasks) => {
  console.log("-- fetch tasks", tasks);
  tasks.forEach((task) => {
    fetchTask(task._id);
  });
});

watch(props, reloadForm, {
  immediate: true,
  deep: true,
});

const onSubmit = (e) => {
  if (e.altKey) return true;
  e.preventDefault();

  const obj = formData.value.save();
  createTask(formData.value).then((obj) => console.log(obj));

  reloadForm();

  // have to wait for the new content to be loaded
  nextTick(() => resizeTextarea());

  emit("after-submit", obj);
};

const autoSave = (e) => {
  // TODO: validation should be somewhere else
  const name = formData.value?.name;
  if (!name || name.trim() === "") return;

  const obj = formData.value.save();

  reloadForm();

  // have to wait for the new content to be loaded
  nextTick(() => resizeTextarea());

  emit("after-submit", obj);
};

const textEl = ref(null);
const resizeTextarea = () => {
  textEl.value && resize(textEl.value);
};

nextTick(() => {
  resizeTextarea();
  if (props.autofocus) {
    textEl.value && textEl.value.focus();
  }
});

const onCancel = () => {
  // release cursor to activate nav mode
  textEl.value?.blur();

  //TODO: should check the content here
  emit("cancel");
};
</script>
<template>
  <div class="list-item">
    <div class="list-item-row flex items-center">
      <span class="list-item-cell">
        <img src="@/assets/arrow-right.svg" alt="focus" class="focus-marker" />
      </span>
      <span class="list-item-marker">-</span>

      <form class="full" @submit.prevent="onSubmit" @keydown.enter.stop>
        <textarea
          ref="textEl"
          rows="1"
          required
          placeholder="what's on your mind?"
          v-model="formData.name"
          @input="resizeTextarea"
          @keydown.esc="onCancel"
          @keydown.enter.ctrl="onSubmit"
          @blur="autoSave"
        ></textarea>
        <input type="submit" value="Submit" />
      </form>

      <span class="seq-info">{{ formData.seq }}</span>
    </div>
  </div>
</template>

<style scoped>
textarea {
  flex: 1;
  border: none;
  outline: none;

  font-family: var(--base-font-family);
  font-size: var(--base-font-size);
  line-height: var(--base-line-height);

  color: var(--color-text);
  color: #c20;

  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 0;
  resize: none;
}
textarea:focus {
  color: var(--color-text);
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

.seq-info {
  font-size: smaller;
  color: #ccc;
  padding: 0 0.5rem;
}
</style>
