<script setup>
import ListItem from "./ListItem.vue";

defineProps(["list", "parent", "appendable"]);
defineEmits(["item-clicked", "dblclick"]);
</script>
<template>
  <div class="a-list">
    <ListItem
      v-for="node in list"
      :node="node"
      :parent="parent"
      :appendable="appendable"
      @item-clicked="(e, node) => $emit('item-clicked', e, node)"
      @dblclick="(node) => $emit('dblclick', node)"
    ></ListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
