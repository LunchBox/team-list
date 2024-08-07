<script setup>
defineProps(["item"]);
</script>
<template>
  <div>
    <div class="toolbar">
      <span>{{ item.start_date }}</span> ~
      <span>{{ item.end_date }}</span> &middot;
      <RouterLink :to="`/tasks/${item.id}`">default</RouterLink> &middot;
      <RouterLink :to="`/tasks/${item.id}/gantt`">gantt</RouterLink> &middot;
      <RouterLink :to="`/tasks/${item.id}/table`">table</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  font-size: smaller;
  margin: 0.5rem 0;
}
</style>
