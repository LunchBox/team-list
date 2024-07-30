<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import useSelection from "@/utils/useSelection.js";

import EditableNodeList from "./EditableNodeList.vue";

const selection = useSelection();

const route = useRoute();
const node = computed(() => find(route.params.sid)); // it is sid
</script>
<template>
  <div>
    <template v-if="node">
      <EditableNodeList
        :parent="node"
        :list="node.children"
        :selection="selection"
      ></EditableNodeList>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
