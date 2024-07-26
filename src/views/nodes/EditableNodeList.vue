<script setup>
import { ref, computed } from "vue";

import useKeydownHandlers from "./useKeydownHandlers.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import useEventListener from "@/utils/useEventListener.js";

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

const onEnterPressed = () => {
  console.log("-- on enter pressed");
  appendMode.value = true;
};

//------------
useKeydownHandlers({
  scopeRef: props.node,
  selection: props.selection,
  activated,
});
</script>
<template>
  <!-- use tabindex to force area focus-able, to accept keydown.enter event -->
  <div
    class="node-list"
    :class="{ activated }"
    tabindex="0"
    @focus="activated = true"
    @blur="activated = false"
    @keydown.enter.prevent.stop="onEnterPressed"
  >
    <NodeList
      v-bind="$attrs"
      :list="list"
      :parent="parent"
      :selection="selection"
      :activated="activated"
      :appendMode="appendMode"
      @item-mousedown="onItemClicked"
      @cancel-append="appendMode = false"
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
