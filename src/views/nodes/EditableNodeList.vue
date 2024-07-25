<script setup>
import { ref, computed } from "vue";

import useKeydownHandlers from "./useKeydownHandlers.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import useEventListener from "@/utils/useEventListener.js";

// 必須提供一個容器用來裝選中的 item
const props = defineProps(["node", "selection", "itemDraggable"]);

const emit = defineEmits(["item-dragstart"]);

// 在 selected list item 下面打開 inline form
const appendMode = ref(false);

const onItemClicked = (e, node) => {
  // 感覺這兩個放在這裡不怎麼合適
  if (e.ctrlKey) {
    props.selection?.toggleSelect(node);
  } else {
    props.selection?.select(node);
  }
  appendMode.value = false;
};

const activated = ref(false);

// 點在畫面上其他地方都 release focus
useEventListener(document, "click", () => {
  activated.value = false;
});

const onEnterPressed = () => {
  console.log("-- on enter pressed");
  appendMode.value = true;
};

//------------
const n = computed(() => props.node);
useKeydownHandlers({ scopeRef: n, selection: props.selection, activated });
</script>
<template>
  <!-- use tabindex to force area focus-able, to accept keydown.enter event -->
  <div
    class="node-list"
    :class="{ activated }"
    tabindex="0"
    @click.stop
    @focus="activated = true"
    @keydown.enter.prevent.stop="onEnterPressed"
  >
    <NodeList
      :list="node.children"
      :parent="node"
      :selection="selection"
      :activated="activated"
      :appendMode="appendMode"
      :itemDraggable="itemDraggable"
      @item-clicked="onItemClicked"
      @item-dragstart="(...args) => $emit('item-dragstart', ...args)"
    >
      <InlineForm :parent="node"></InlineForm>
    </NodeList>
  </div>
</template>

<style scoped>
.node-list {
  padding-bottom: 80vh;

  &.activated {
    outline: 2px solid #222;
  }
}
.node-list:focus {
  outline: 2px solid #ccc;
}
</style>
