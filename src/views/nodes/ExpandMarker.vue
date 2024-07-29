<script setup>
defineProps(["node"]);
</script>
<template>
  <span v-if="node.isChildrenBlank" class="list-item-marker"> - </span>
  <a
    v-else
    href="#"
    class="list-item-marker"
    @click.prevent.stop="node.exp = !node.exp"
  >
    {{ node.exp ? "-" : "+" }}
  </a>
</template>
