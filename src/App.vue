<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <RouterLink to="/">Home</RouterLink> &middot;
    <RouterLink to="/tasks">Tasks</RouterLink> &middot;
    <RouterLink to="/nodes">Nodes</RouterLink>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  font-size: smaller;
}
</style>
