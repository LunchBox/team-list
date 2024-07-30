<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Project from "@/stores/project.js";

import ProjectForm from "./ProjectForm.vue";

const route = useRoute();
const proj = computed(() => Project.find(route.params.id));
</script>
<template>
  <template v-if="proj">
    <ProjectForm :project="proj"></ProjectForm>
  </template>
  <div v-else>Not Found...</div>
</template>
