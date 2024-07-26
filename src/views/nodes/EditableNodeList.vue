<script setup>
import { ref, computed, nextTick } from "vue";

import editableNodeListEventHandler from "./EditableNodeListEventHandler.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import useEventListener from "@/utils/useEventListener.js";
import { elemInsideContainer } from "@/utils/elemInsideContainer.js";

// 必須提供一個容器用來裝選中的 item
const props = defineProps(["list", "parent", "selection"]);
const emit = defineEmits(["item-clicked"]);

// 在 selected list item 下面打開 inline form
const appendMode = ref(false);

const onItemClicked = (e, node) => {
  props.selection?.handleSelect(e, node);
  appendMode.value = false;
  emit("item-clicked", e, node);
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

const onCancelAppend = () => {
  appendMode.value = false;

  // use esc to cancel the append mode will lost focus, manually activate it again
  activated.value = true;
};

//------------
editableNodeListEventHandler({
  scopeRef: computed(() => props.parent),
  selection: props.selection,
  activated,
});
</script>
<template>
  <!-- use tabindex to force area focus-able, to accept keydown.enter event -->
  <div class="node-list" ref="rootEl" :class="{ activated }">
    <NodeList
      v-bind="$attrs"
      :list="list"
      :parent="parent"
      :selection="selection"
      :activated="activated"
      :appendMode="appendMode"
      @item-mousedown="onItemClicked"
      @cancel-append="onCancelAppend"
    >
      <InlineForm :parent="parent"></InlineForm>
    </NodeList>
  </div>
</template>

<style scoped>
.node-list {
  &.activated {
    outline: 2px solid #222;
  }
}
.node-list:focus {
  outline: 2px solid #ccc;
}
</style>
