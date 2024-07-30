<script setup>
import { RouterView } from "vue-router";

import Task from "@/stores/task.js";
</script>

<template>
  <div>
    <div class="toolbar">
      <a href="#" @click.prevent="() => Task.expandAll()">Expand</a> &middot;
      <a href="#" @click.prevent="() => Task.collapseAll()">Collapse</a>
    </div>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
main {
  max-width: 100%;
  padding: 0 1rem;
  min-height: 80vh;
}

.toolbar {
  font-size: small;
  margin-bottom: 0.5rem;
}
</style>
