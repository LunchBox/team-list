<script setup>
defineProps(["item"]);
</script>
<template>
  <span v-if="item.isChildrenBlank" class="list-item-marker"> - </span>
  <a
    v-else
    href="#"
    class="list-item-marker"
    @click.prevent.stop="item.exp = !item.exp"
  >
    {{ item.exp ? "-" : "+" }}
  </a>
</template>
