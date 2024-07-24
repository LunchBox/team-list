<script setup>
import { useRouter } from "vue-router";
import { focusing, selection } from "@/stores/nodes.js";

import useKeydownHandlers from "@/views/nodes/keydown_handlers.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import { jsondata } from "./sample.js";

const props = defineProps(["node", "parent"]);

useKeydownHandlers();

const router = useRouter();
const onDblClick = (node) => {
  router.push({ path: `/nodes/${node.id}` });
  focusing.value = node;
};

const { select, toggleSelect } = selection;

const onNodeClicked = (e, node) => {
  focusing.value = node;

  if (e.ctrlKey) {
    toggleSelect(node);
  } else {
    select(node);
  }
};
</script>
<template>
  <div>
    <div style="padding-bottom: 80vh">
      <NodeList
        :list="node.children"
        :parent="node"
        :appendable="true"
        @item-clicked="onNodeClicked"
        @dblclick="onDblClick"
      >
        <InlineForm :parent="node"></InlineForm>
      </NodeList>
    </div>

    <template v-if="false">
      <div>This is a testing of a vue excel editor</div>
      <vue-excel-editor v-model="jsondata" filter-row />
    </template>
  </div>
</template>

<style scoped></style>
