<script setup>
import { nextTick, ref, watch, inject } from "vue";

import Task from "@/stores/task.js";
import resize from "@/utils/resizeable.js";

const props = defineProps(["item", "parent", "seq", "autofocus"]);
const emit = defineEmits(["after-submit", "cancel"]);

const project = inject("project");

const formData = ref(null);

const reloadForm = () => {
  formData.value = Object.assign(new Task(), {
    ...props.item,
    projectId: project?.value?.id,
  });

  formData.value.seq =
    (props.item?.id && props.item?.seq) ??
    (props.seq ??
      props.parent?.maxChildSeq ??
      props.item?.parent?.maxRootSeq.value ??
      -1) + 1;

  if (props.parent) {
    formData.value.parentId = props.parent?.id;
  }
};

watch(props, reloadForm, {
  immediate: true,
});

const onSubmit = (e) => {
  if (e.altKey) return true;
  e.preventDefault();

  const obj = formData.value.save();

  reloadForm();

  // have to wait for the new content to be loaded
  nextTick(() => resizeTextarea());

  emit("after-submit", obj);
};

const autoSave = (e) => {
  const content = formData.value?.content;
  if (!content || content.trim() === "") return;

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
</style>
