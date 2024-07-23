<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";

import NodeForm from "./NodeForm.vue";
import Breadcrumbs from "./Breadcrumbs.vue";

const route = useRoute();
const node = computed(() => find(route.params.id));
</script>
<template>
  <template v-if="node">
    <Breadcrumbs :node="node"></Breadcrumbs>
    <NodeForm :node="node"></NodeForm>
  </template>
  <div v-else>Not Found...</div>
</template>
