<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/tasks.js";
import TaskDetails from "./TaskDetails.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

const route = useRoute();

const task = computed(() => {
  return find(route.params.id);
});
</script>
<template>
  <Breadcrumbs :task="task"></Breadcrumbs>
  <TaskDetails v-if="task" :task="task"></TaskDetails>
  <div v-else>Not Found...</div>
</template>
