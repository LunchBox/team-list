<script setup>
import ListItem from "./ListItem.vue";

const props = defineProps([
  "list",
  "parent",
  "activated",
  "appendMode",
  "itemDraggable",
  "selection",
]);

const emit = defineEmits([
  "item-dragstart",
  "item-mousedown",
  "item-clicked",
  "dblclick",
  "after-append",
]);
</script>
<template>
  <div class="a-list">
    <ListItem
      v-for="node in list"
      :node="node"
      :parent="parent"
      :draggable="itemDraggable"
      :activated="activated"
      :selection="selection"
      :appendMode="appendMode"
      @item-dragstart="(...args) => $emit('item-dragstart', ...args)"
      @item-mousedown="(...args) => $emit('item-mousedown', ...args)"
      @item-clicked="(...args) => $emit('item-clicked', ...args)"
      @dblclick="(node) => $emit('dblclick', node)"
      @after-append="(...args) => $emit('after-append', ...args)"
    ></ListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
