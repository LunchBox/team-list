<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <RouterLink to="/">Home</RouterLink> &middot;
    <RouterLink to="/tasks">Tasks</RouterLink>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  font-size: smaller;
}
</style>
