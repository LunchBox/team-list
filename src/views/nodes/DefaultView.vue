<script setup>
import useKeydownHandlers from "@/views/nodes/keydown_handlers.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import { jsondata } from "./sample.js";

const props = defineProps(["node", "parent"]);

useKeydownHandlers();
</script>
<template>
  <div>
    <div style="padding-bottom: 80vh">
      <NodeList :list="node.children" :parent="node" :appendable="true">
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
