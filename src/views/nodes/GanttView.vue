<script setup>
import { computed } from "vue";
import GanttView from "@/views/gantt/GanttView.vue";
import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import { focusing } from "@/stores/nodes.js";

const props = defineProps(["node"]);

const itemList = computed(() => {
  return props.node.getExpanedChildren();
});
</script>
<template>
  <GanttView :list="itemList">
    <template #aside>
      <NodeList
        :list="node.children"
        :parent="node"
        :appendable="true"
        @click="(node) => (focusing = node)"
      >
        <InlineForm :parent="node"></InlineForm>
      </NodeList>
    </template>
  </GanttView>
</template>
