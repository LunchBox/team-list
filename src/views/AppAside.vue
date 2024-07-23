<script setup>
import { useRouter } from "vue-router";
import useEventListener from "@/utils/useEventListener.js";
import {
  rootNodes,
  focusing,
  expandAll,
  collapseAll,
  resetList,
} from "@/stores/nodes.js";
import useKeydownHandlers from "@/views/nodes/keydown_handlers.js";

import NodeList from "@/views/nodes/NodeList.vue";
import InlineForm from "@/views/nodes/InlineForm.vue";

// 點在畫面上其他地方都 release focus
useEventListener(document, "click", () => (focusing.value = null));

useKeydownHandlers();

const clear = () => {
  if (!confirm("Are you sure?")) return;
  resetList();
};

const router = useRouter();
const onClick = (node) => {
  router.push({ name: "node", params: { id: node.id } });
  focusing.value = node;
};
</script>
<template>
  <div>
    <div class="toolbar">
      <a href="#" @click.prevent="expandAll">Expand All</a> &middot;
      <a href="#" @click.prevent="collapseAll">Collapse All</a> &middot;
      <a href="#" @click.prevent="clear">Delete All</a>
    </div>

    <NodeList :list="rootNodes" @click="onClick">
      <InlineForm></InlineForm>
    </NodeList>
  </div>
</template>

<style scoped>
.toolbar {
  font-size: smaller;
  margin: 1rem 0;
}
</style>
