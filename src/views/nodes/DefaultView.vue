<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";
import useKeydownHandlers from "./useKeydownHandlers.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

// just a excel layout data, delete it later
import { jsondata } from "./sample.js";

const route = useRoute();
const node = computed(() => {
  return find(route.params.id);
});

useKeydownHandlers({ scopeRef: node });
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <div style="padding-bottom: 80vh">
        <NodeList :list="node.children" :parent="node" :appendable="true">
          <InlineForm :parent="node"></InlineForm>
        </NodeList>
      </div>

      <template v-if="false">
        <div>This is a testing of a vue excel editor</div>
        <vue-excel-editor v-model="jsondata" filter-row />
      </template>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
