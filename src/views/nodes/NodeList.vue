<script setup>
import ListItem from "./ListItem.vue";

const props = defineProps(["list"]);

// 這裡用 v-bind 將所有 props 和 emits relay 到下一層
</script>
<template>
  <div class="a-list">
    <ListItem v-for="node in list" :node="node" v-bind="$attrs"></ListItem>
    <slot></slot>
  </div>
</template>

<style scoped></style>
