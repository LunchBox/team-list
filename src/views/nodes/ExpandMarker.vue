<script setup>
defineProps(["node"]);
</script>
<template>
  <a
    href="#"
    class="list-item-marker"
    @click.prevent.stop="node.exp = !node.exp"
  >
    {{ node.exp ? "-" : "+" }}
  </a>
</template>
