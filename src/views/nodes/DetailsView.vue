<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import NodeDetails from "./Details.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

const route = useRoute();

const node = computed(() => {
  return find(route.params.id);
});
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <NodeDetails :node="node"></NodeDetails>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
