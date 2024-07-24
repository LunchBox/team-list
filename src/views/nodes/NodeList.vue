<script setup>
import ListItem from "./ListItem.vue";

const props = defineProps(["list", "parent", "appendable", "itemDraggable"]);
const emit = defineEmits([
  "item-dragstart",
  "item-mousedown",
  "item-clicked",
  "dblclick",
]);
</script>
<template>
  <div class="a-list">
    <ListItem
      v-for="node in list"
      :node="node"
      :parent="parent"
      :appendable="appendable"
      :draggable="itemDraggable"
      @item-dragstart="(...args) => $emit('item-dragstart', ...args)"
      @item-mousedown="(...args) => $emit('item-mousedown', ...args)"
      @item-clicked="(...args) => $emit('item-clicked', ...args)"
      @dblclick="(node) => $emit('dblclick', node)"
    ></ListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
