<script setup>
import { nextTick, ref, watch } from "vue";

import { Task, focusing, appendMode, maxRootSeq } from "@/stores/tasks.js";
import resize from "@/utils/resizeable.js";

const props = defineProps(["task", "parent", "seq"]);
const emit = defineEmits(["after-submit"]);

const formData = ref(null);

const reloadForm = () => {
  formData.value = Object.assign(new Task(), { ...props.task });
  formData.value.seq =
    (props.seq ?? props.parent?.maxChildSeq ?? maxRootSeq.value ?? -1) + 1;

  if (props.parent) {
    formData.value.parentId = props.parent?.id;
  }
};

watch(props, reloadForm, {
  immediate: true,
});

const onSubmit = () => {
  const obj = formData.value.save();
  focusing.value = obj;

  reloadForm();

  // have to wait for the new content to be loaded
  nextTick(() => {
    resizeTextarea();
  });

  emit("after-submit", obj);
};

const textEl = ref(null);
const resizeTextarea = () => {
  textEl.value && resize(textEl.value);
};

nextTick(() => {
  textEl.value && textEl.value.focus();
});
</script>
<template>
  <div class="list-item">
    <div class="list-item-row flex items-center">
      <span class="list-item-marker">-</span>

      <form class="full" @submit.prevent="onSubmit" @keydown.stop>
        <textarea
          ref="textEl"
          rows="1"
          required
          placeholder="what's on your mind?"
          v-model="formData.title"
          @input="resizeTextarea"
          @keydown.enter.prevent="onSubmit"
          @keydown.esc.prevent="appendMode = false"
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
  color: #bbb;

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
