<script setup>
import { ref, computed, toValue } from "vue";

import MarkedText from "@/components/MarkedText.vue";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";
import ExpandMarker from "./ExpandMarker.vue";

import useEventListener from "@/utils/useEventListener.js";
import { elemInForm } from "@/utils/elemInsideContainer.js";

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
  "item-dblclick",
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

  if (elemInForm(e.target)) return;

  if (e.key === "i" || e.key === "e") {
    e.preventDefault();
    e.stopPropagation();
    quickEdit.value = true;
  }
});

const afterQuickEdit = () => {
  quickEdit.value = false;
};

const onDoubleClick = (e) => {
  quickEdit.value = true;
  emit("item-dblclick", e, props.node);
};

// ---- after append
const afterAppend = (node) => {
  props.selection?.select(node);
};

// ---- on drop to sort items
const dragging = ref(false);
const hover = ref(false);
const onDrop = (...args) => {
  let prev = props.node;
  const items = toValue(props.selection.selectedItems);
  for (const item of items) {
    item.moveToAfter(prev);
    prev = item;
  }
  hover.value = false;
};

// only allow task to be drag
const draggableContentTypes = ["Task"];

const isDraggable = computed(() => {
  if (!draggableContentTypes.includes(props.node?.contentType)) return false;
  return toValue(dragging) || toValue(props.itemDraggable);
});
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
  <div
    v-else
    v-bind="$attrs"
    class="list-item"
    :class="{ selected, hover }"
    @drop="onDrop"
    @dragover.prevent="hover = true"
    @dragleave="hover = false"
  >
    <div
      class="list-item-row flex items-center"
      ref="itemRowRef"
      :draggable="isDraggable"
      @dragstart="$emit('item-dragstart', $event, node)"
      @mousedown.left="$emit('item-mousedown', $event, node)"
      @click.left.prevent="onNodeClicked"
    >
      <div class="list-item-cell">
        <RouterLink :to="`/nodes/${node.id}`" class="focus-marker">
          <!-- <img src="@/assets/arrow-right.svg" alt="focus" /> -->
        </RouterLink>
      </div>

      <template v-if="node.isChildrenBlank">
        <span class="list-item-marker" @mousedown.left="dragging = true">
          -
        </span>

        <span v-if="node.isTask" class="list-item-cell">
          <input type="checkbox" />
        </span>

        <MarkedText
          class="node-content full"
          :text="node.content"
          @dblclick="onDoubleClick"
        ></MarkedText>
      </template>
      <template v-else>
        <ExpandMarker :node="node"></ExpandMarker>

        <span v-if="node.isTask" class="list-item-cell">
          <input type="checkbox" />
        </span>

        <a href="#" class="node-content full" @dblclick="onDoubleClick">
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
      @item-dblclick="(...args) => $emit('item-dblclick', ...args)"
      @after-append="(...args) => $emit('after-append', ...args)"
      @cancel-append="(...args) => $emit('cancel-append', ...args)"
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
.list-item {
  position: relative;

  &.hover:before {
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 2px solid #ccc;
  }
}

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
