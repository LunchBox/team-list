<script setup>
import { ref, computed, inject } from "vue";

import useEventListener from "@/utils/useEventListener.js";
import { elemInsideContainer } from "@/utils/elemInsideContainer.js";

import EditableListItem from "./EditableListItem.vue";

import editableListEventHandler from "./EditableListEventHandler.js";

import ItemList from "./ItemList.vue";
import InlineForm from "./InlineForm.vue";

// 必須提供一個容器用來裝選中的 item
const props = defineProps(["list", "parent"]);
const emit = defineEmits(["item-clicked"]);

const selection = inject("selection");
const { select, handleSelect } = selection;

// 在 selected list item 下面打開 inline form
const appendMode = ref(false);

const onItemClicked = (e, item) => {
  console.log("-- here??");
  handleSelect(e, item);

  appendMode.value = false;
  emit("item-clicked", e, item);
};

const activated = ref(false);
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

    <ItemList
      v-bind="$attrs"
      :list="list"
      :parent="parent"
      :activated="activated"
      :appendMode="appendMode"
      @item-mousedown="onItemClicked"
      @cancel-append="onCancel"
    >
      <InlineForm
        v-if="!appendMode"
        :parent="parent"
        @after-submit="onAfterSubmit"
        @cancel="onCancel"
      ></InlineForm>
    </ItemList>
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
