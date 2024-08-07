<script setup>
import { ref, computed, inject, provide } from "vue";

import EditableListItem from "./EditableListItem.vue";

import editableListEventHandler from "@/views/nested_view/EditableListEventHandler.js";

import ListItem from "./ListItem.vue";
import InlineForm from "./InlineForm.vue";

import useEventListener from "@/utils/useEventListener.js";
import { elemInsideContainer } from "@/utils/elemInsideContainer.js";

// 必須提供一個容器用來裝選中的 item
const props = defineProps(["list", "parent"]);

// 在 selected list item 下面打開 inline form
const appendMode = ref(false);
provide("appendMode", appendMode);

const activated = ref(false);
provide("activated", activated);

const selection = inject("selection");
const { handleSelect, select } = selection;

const onItemMousedown = (e, item) => {
  handleSelect(e, item);
  appendMode.value = false;
};

const rootEl = ref(null);

const onEnterPressed = () => {
  console.log("-- on enter pressed");
  appendMode.value = true;
};

useEventListener(window, "mousedown", (e) => {
  activated.value = elemInsideContainer(e.target, rootEl.value);
});

useEventListener(window, "keydown", (e) => {
  if (e.key === "Enter" && activated.value) {
    e.preventDefault();
    onEnterPressed();
  }
});

const onCancel = () => {
  console.log("-- on cancel");
  appendMode.value = false;

  // use esc to cancel the append mode will lost focus, manually activate it again
  activated.value = true;
};

const onAfterSubmit = (item) => {
  console.log("after-submit", item);
  select(item);
  appendMode.value = true;
  // console.log("-- after submit", args);
};

//------------
editableListEventHandler({
  scopeRef: computed(() => props.parent),
  selection,
  activated,
});
</script>

<template>
  <!-- use tabindex to force area focus-able, to accept keydown.enter event -->
  <div class="editable-list" ref="rootEl" :class="{ activated }">
    <div v-if="parent" class="a-list">
      <EditableListItem :item="parent"></EditableListItem>
    </div>

    <div class="a-list">
      <ListItem
        v-bind="$attrs"
        v-for="child in list"
        :item="child"
        :parent="parent"
        @item-mousedown="onItemMousedown"
        @cancel-append="onCancel"
      ></ListItem>
      <InlineForm
        v-if="!appendMode"
        :parent="parent"
        @after-submit="onAfterSubmit"
        @cancel="onCancel"
      ></InlineForm>
    </div>
  </div>
</template>

<style scoped>
.editable-list {
  &.activated {
    outline: 2px solid #222;
  }
}
.editable-list:focus {
  outline: 2px solid #ccc;
}
</style>
