<script setup>
import { computed, toValue, provide } from "vue";
import { useRoute } from "vue-router";

import useSelection from "@/utils/useSelection.js";
import Project from "@/stores/project.js";
import EditableList from "../tasks/EditableList.vue";

const route = useRoute();
const project = computed(() => Project.find(route.params.id));

provide("project", project);

const tasks = computed(() => project.value.tasks);

const selection = useSelection();
</script>
<template>
  <div>
    <h2>{{ project.name }}</h2>
    <div>
      <RouterLink :to="`/projects/${project.id}/edit`">Edit</RouterLink>
    </div>

    <h3>Tasks</h3>

    <EditableList :list="tasks" :selection="selection"></EditableList>

    <h3>Status Update</h3>
  </div>
</template>
