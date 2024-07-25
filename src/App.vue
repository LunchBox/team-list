<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink> &middot;
        <RouterLink to="/about">About</RouterLink> &middot;
        <RouterLink to="/nodes">Nodes</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
<style></style>
