<script setup>
import { ref, computed, toValue, inject } from "vue";

import MarkedText from "@/components/MarkedText.vue";

// import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";
import ExpandMarker from "./ExpandMarker.vue";
import CheckBox from "./CheckBox.vue";

import useEventListener from "@/utils/useEventListener.js";
import { elemInForm } from "@/utils/elemInsideContainer.js";

const props = defineProps(["item", "parent", "itemDraggable"]);

const emit = defineEmits([
  "item-dragstart",
  "item-mousedown",
  "item-clicked",
  "item-dblclick",
  "after-append",
  "cancel-append",
]);

defineOptions({
  inheritAttrs: false,
});

const selection = inject("selection");
const { hasSelected, select } = selection;

const selected = computed(() => hasSelected(props.item));

const appendMode = inject("appendMode");

const activated = inject("activated");

const onItemClicked = (e) => {
  emit("item-clicked", e, props.item);
};

// ---- quick edit
const quickEdit = ref(false);
useEventListener(document, "keydown", (e) => {
  if (!toValue(activated)) return;
  if (!toValue(selected)) return;
  if (toValue(appendMode)) return;

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
  emit("item-dblclick", e, props.item);
};

// ---- after append
const afterAppend = (item) => {
  select(item);
};

// ---- on drop to sort items
// const dragging = ref(false);
// const hover = ref(false);
// const onDrop = (...args) => {
//   let prev = props.node;
//   const items = toValue(props.selection.selectedItems);
//   for (const item of items) {
//     item.moveToAfter(prev);
//     prev = item;
//   }
//   hover.value = false;
// };

const isDraggable = computed(() => {
  return toValue(props.itemDraggable);
  // return toValue(dragging) || toValue(props.itemDraggable);
});
</script>
<template>
  <!-- editing mode -->
  <InlineForm
    v-if="quickEdit && selected"
    :item="item"
    :autofocus="true"
    style="outline: 1px solid #ccc"
    @after-submit="afterQuickEdit"
  ></InlineForm>
  <!-- display mode -->
  <div
    v-else
    v-bind="$attrs"
    class="list-item"
    :class="{ selected }"
    @dragover.prevent
  >
    <div
      class="list-item-row flex items-center"
      ref="itemRowRef"
      :draggable="isDraggable"
      @dragstart="$emit('item-dragstart', $event, item)"
      @mousedown.left="$emit('item-mousedown', $event, item)"
      @click.left.prevent="onItemClicked"
    >
      <div class="list-item-cell">
        <RouterLink :to="`/tasks/${item.id}`" class="focus-marker">
          <!-- <img src="@/assets/arrow-right.svg" alt="focus" /> -->
        </RouterLink>
      </div>

      <ExpandMarker :item="item"></ExpandMarker>

      <CheckBox class="list-item-cell" :item="item"></CheckBox>

      <template v-if="item.isChildrenBlank">
        <MarkedText
          class="item-content full"
          :text="item.name"
          @dblclick="onDoubleClick"
        ></MarkedText>
      </template>
      <template v-else>
        <a href="#" class="item-content full" @dblclick="onDoubleClick">
          {{ item.name }}
        </a>

        <span class="child-info">
          ({{ item.children.length }} : {{ item.allChildrenLen }})
        </span>
      </template>

      <span class="seq-info">{{ item.seq }}</span>
    </div>

    <div class="a-list" v-if="item.exp">
      <ListItem
        v-bind="$attrs"
        v-for="child in item.children"
        :item="child"
        :itemDraggable="itemDraggable"
        @item-dragstart="(...args) => $emit('item-dragstart', ...args)"
        @item-mousedown="(...args) => $emit('item-mousedown', ...args)"
        @item-clicked="(...args) => $emit('item-clicked', ...args)"
        @item-dblclick="(...args) => $emit('item-dblclick', ...args)"
        @after-append="(...args) => $emit('after-append', ...args)"
        @cancel-append="(...args) => $emit('cancel-append', ...args)"
      ></ListItem>
      <slot></slot>
    </div>
  </div>
  <!-- appending mode, append contents after focusing item -->
  <InlineForm
    v-if="selected && appendMode"
    :parent="item.parent"
    :seq="item.seq"
    :autofocus="true"
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
