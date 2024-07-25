<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import useSelection from "@/utils/useSelection.js";

import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";

import EditableNodeList from "./EditableNodeList.vue";

const selection = useSelection();

const route = useRoute();
const node = computed(() => find(route.params.id));
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <EditableNodeList :node="node" :selection="selection"></EditableNodeList>

      <template v-if="false">
        <div>This is a testing of a vue excel editor</div>
        <vue-excel-editor v-model="jsondata" filter-row />
      </template>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped>
.node-list {
  padding-bottom: 80vh;

  &.activated {
    outline: 2px solid #222;
  }
}
.node-list:focus {
  outline: 2px solid #ccc;
}
</style>
