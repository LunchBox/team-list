<script setup>
const props = defineProps(["node"]);

const onInput = () => {
  props.node.isDone = !props.node.isDone;
};
</script>
<template>
  <span>
    <input type="checkbox" @mousedown="onInput" :checked="node.isDone" />
  </span>
</template>
