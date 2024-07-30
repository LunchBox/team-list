<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Task from "@/stores/task.js";

import NodeForm from "./NodeForm.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

const route = useRoute();
const item = computed(() => Task.find(route.params.id));
</script>
<template>
  <template v-if="item">
    <Breadcrumbs :item="item"></Breadcrumbs>
    <NodeForm :item="item"></NodeForm>
  </template>
  <div v-else>Not Found...</div>
</template>
