<script setup>
const props = defineProps(["item"]);

const onInput = () => {
  props.item.isDone = !props.item.isDone;
};
</script>
<template>
  <span>
    <input type="checkbox" @mousedown="onInput" :checked="item.isDone" />
  </span>
</template>
