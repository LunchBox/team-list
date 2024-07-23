<script setup>
import { useRouter } from "vue-router";
import { focusing } from "@/stores/nodes.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import { jsondata } from "./sample.js";

const props = defineProps(["node", "parent"]);

const router = useRouter();
const onDblClick = (node) => {
  router.push({ path: `/nodes/${node.id}` });
  focusing.value = node;
};
</script>
<template>
  <div>
    <div style="padding-bottom: 80vh">
      <NodeList
        :list="node.children"
        :parent="node"
        :appendable="true"
        @click="(node) => (focusing = node)"
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
