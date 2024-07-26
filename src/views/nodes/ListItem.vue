<script setup>
import { ref, computed } from "vue";

import MarkedText from "@/components/MarkedText.vue";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";
import ExpandMarker from "./ExpandMarker.vue";

import useEventListener from "@/utils/useEventListener.js";

const props = defineProps([
  "node",
  "parent",
  "itemDraggable",
  "selection",
  "activated",
  "appendMode",
]);

const emit = defineEmits([
  "item-dragstart",
  "item-mousedown",
  "item-clicked",
  "dblclick",
  "after-append",
  "cancel-append",
]);

const selected = computed(() => props.selection?.hasSelected(props.node));

defineOptions({
  inheritAttrs: false,
});

const onNodeClicked = (e) => {
  emit("item-clicked", e, props.node);
};

// ---- quick edit
const quickEdit = ref(false);
useEventListener(document, "keydown", (e) => {
  if (!props.activated) return;
  if (!selected.value) return;
  if (props.appendMode) return;

  if (e.key === "i" || e.key === "e") {
    e.preventDefault();
    e.stopPropagation();
    quickEdit.value = true;
  }
});

const afterQuickEdit = () => {
  quickEdit.value = false;
};

// ---- after append
const afterAppend = (node) => {
  props.selection?.select(node);
};
</script>
<template>
  <!-- editing mode -->
  <InlineForm
    v-if="quickEdit && selected"
    :node="node"
    style="outline: 1px solid #ccc"
    @after-submit="afterQuickEdit"
  ></InlineForm>
  <!-- display mode -->
  <div v-else v-bind="$attrs" class="list-item" :class="{ selected }">
    <div
      class="list-item-row flex items-center"
      ref="itemRowRef"
      :draggable="itemDraggable"
      @dragstart="$emit('item-dragstart', $event, node)"
      @mousedown="$emit('item-mousedown', $event, node)"
      @click.left.prevent="onNodeClicked"
    >
      <div class="list-item-cell">
        <RouterLink :to="`/nodes/${node.id}`" class="focus-marker">
          <!-- <img src="@/assets/arrow-right.svg" alt="focus" /> -->
        </RouterLink>
      </div>

      <template v-if="node.isChildrenBlank">
        <span class="list-item-marker">-</span>

        <MarkedText
          class="node-content full"
          :text="node.content"
          @dblclick="$emit('dblclick', node)"
        ></MarkedText>
      </template>
      <template v-else>
        <ExpandMarker :node="node"></ExpandMarker>
        <a
          href="#"
          class="node-content full"
          @dblclick="$emit('dblclick', node)"
        >
          {{ node.content }}
        </a>
        <span class="child-info">
          ({{ node.children.length }} : {{ node.allChildrenLen }})
        </span>
      </template>
      <span class="seq-info">{{ node.seq }}</span>
    </div>

    <NodeList
      v-if="node.exp"
      v-bind="$attrs"
      :list="node.children"
      :parent="node"
      :itemDraggable="itemDraggable"
      :selection="selection"
      :activated="activated"
      :appendMode="appendMode"
      @item-dragstart="(...args) => $emit('item-dragstart', ...args)"
      @item-mousedown="(...args) => $emit('item-mousedown', ...args)"
      @item-clicked="(...args) => $emit('item-clicked', ...args)"
      @dblclick="(node) => $emit('dblclick', node)"
    ></NodeList>
  </div>
  <!-- appending mode, append contents after focusing item -->
  <InlineForm
    v-if="selected && appendMode"
    :parent="node.parent"
    :seq="node.seq"
    @after-submit="afterAppend"
    @cancel="(...args) => $emit('cancel-append', ...args)"
  ></InlineForm>
</template>

<style scoped>
.list-item-row {
  outline: none;
}

.child-info {
  color: #ccc;
  font-style: italic;
  font-size: smaller;
}

.seq-info {
  font-size: smaller;
  color: #ccc;
  padding: 0 0.5rem;
}

.list-item-row:focus {
  outline: 2px solid red;
}
</style>
