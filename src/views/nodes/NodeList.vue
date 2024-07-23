<script setup>
import ListItem from "./ListItem.vue";

defineProps(["list", "parent", "appendable"]);
defineEmits(["click", "dblclick"]);
</script>
<template>
  <div class="a-list">
    <ListItem
      v-for="node in list"
      :node="node"
      :parent="parent"
      :appendable="appendable"
      @click="(node) => $emit('click', node)"
      @dblclick="(node) => $emit('dblclick', node)"
    ></ListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
