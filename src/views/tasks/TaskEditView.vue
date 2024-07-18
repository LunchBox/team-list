<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/tasks.js";

import TaskForm from "./TaskForm.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

const route = useRoute();
const task = computed(() => find(route.params.id));
</script>
<template>
  <template v-if="task">
    <Breadcrumbs :task="task"></Breadcrumbs>
    <TaskForm :task="task"></TaskForm>
  </template>
  <div v-else>Not Found...</div>
</template>
