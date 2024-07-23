<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import Breadcrumbs from "./Breadcrumbs.vue";
import DefaultView from "./DefaultView.vue";
import GanttView from "./GanttView.vue";

const route = useRoute();

const node = computed(() => {
  return find(route.params.id);
});

const mode = ref("gantt");
</script>
<template>
  <div>
    <div style="margin: 1rem 0">
      <a href="#" @click.prevent="mode = null">Default View</a> &middot;
      <a href="#" @click.prevent="mode = 'gantt'">Gantt View</a>
    </div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <DefaultView v-if="!mode" :node="node"></DefaultView>
      <GanttView v-if="mode === 'gantt'" :node="node"></GanttView>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
