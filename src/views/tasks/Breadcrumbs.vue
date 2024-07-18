<script setup>
import { computed } from "vue";
const props = defineProps(["task"]);

const tasks = computed(() => {
  return props.task.getPath();
});
</script>

<template>
  <div class="breadcrumbs">
    <template v-for="t in tasks">
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
