<script setup>
import { computed, toValue } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import useSelection from "@/utils/useSelection.js";

import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";

import EditableNodeList from "./EditableNodeList.vue";

const selection = useSelection();

const route = useRoute();
const node = computed(() => find(route.params.id));

const convertTo = (contentType = null) => {
  const items = toValue(selection.selectedItems);
  items.forEach((n) => (n.contentType = contentType));
};
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node">
        Convert to:
        <a href="#" @click.prevent="convertTo('Task')"> Task </a> |
        <a href="#" @click.prevent="convertTo()"> Text </a>
        &middot;
      </Header>

      <div style="padding-bottom: 80vh">
        <EditableNodeList
          :parent="node"
          :list="node.children"
          :selection="selection"
        ></EditableNodeList>
      </div>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
