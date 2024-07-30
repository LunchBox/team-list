<script setup>
import { computed } from "vue";
const props = defineProps(["item"]);

const items = computed(() => {
  return props.item.getPath();
});
</script>

<template>
  <div class="breadcrumbs">
    <template v-for="t in items">
      <span> / </span>
      <RouterLink :to="`/tasks/${t.id}`">
        {{ t.content }}
      </RouterLink>
    </template>
  </div>
</template>

<style scoped>
.breadcrumbs {
  margin: 0.5rem 0;
}
</style>
