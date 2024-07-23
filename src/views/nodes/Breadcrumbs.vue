<script setup>
import { computed } from "vue";
const props = defineProps(["node"]);

const nodes = computed(() => {
  return props.node.getPath();
});
</script>

<template>
  <div class="breadcrumbs">
    <template v-for="t in nodes">
      <span>/</span>
      <RouterLink :to="`/nodes/${t.id}`">
        {{ t.title }}
      </RouterLink>
    </template>
  </div>
</template>

<style scoped>
.breadcrumbs {
  margin-bottom: 1rem;
}
</style>
