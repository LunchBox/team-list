<script setup>
import { useRouter } from "vue-router";
import { rootNodes } from "@/stores/nodes.js";

import NodeList from "@/views/nodes/NodeList.vue";
import InlineForm from "@/views/nodes/InlineForm.vue";

const router = useRouter();
const onItemClick = (e, node) => {
  router.push({ name: "node", params: { id: node.id } });
};
</script>
<template>
  <div>
    <NodeList :list="rootNodes" @item-clicked="onItemClick">
      <InlineForm></InlineForm>
    </NodeList>
  </div>
</template>

<style scoped></style>
