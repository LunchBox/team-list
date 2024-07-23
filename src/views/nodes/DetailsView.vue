<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";
import DefaultView from "./DefaultView.vue";
import GanttView from "./GanttView.vue";

const route = useRoute();

const node = computed(() => {
  return find(route.params.id);
});
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <GanttView v-if="node.viewType === 'gantt'" :node="node"></GanttView>
      <DefaultView v-else :node="node"></DefaultView>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
