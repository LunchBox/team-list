<script setup>
import { computed, toValue } from "vue";
import { useRoute } from "vue-router";

import Project from "@/stores/project.js";

const route = useRoute();
const project = computed(() => Project.find(route.params.id));
</script>
<template>
  <div>
    <h2>{{ project.name }}</h2>
    <div>
      <RouterLink :to="`/projects/${project.id}/edit`">Edit</RouterLink>
    </div>
  </div>
</template>
