<script setup>
import { RouterLink, RouterView } from "vue-router";

import TaskDetails from "./views/tasks/TaskDetails.vue";
import TaskForm from "./views/tasks/TaskForm.vue";
import AppAside from "./views/AppAside.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <div class="flex" @click.stop>
    <AppAside></AppAside>
    <main>
      <RouterView />
      <!-- <div v-if="editing">
        <TaskForm :task="editing"></TaskForm>
      </div>
      <div v-else-if="focusing">
        <TaskDetails :task="focusing"></TaskDetails>
      </div> -->
    </main>
  </div>
</template>

<style scoped></style>
<style>
.flex {
  display: flex;
}

.list-item {
  margin: 4px 0;
  padding-left: 1rem;
}

main {
  flex: 1;
  padding: 1rem;
  min-height: 80vh;
  border-left: 2px solid #f0f0f0;
}
</style>
