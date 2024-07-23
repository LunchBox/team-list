<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { focusing, destroy } from "@/stores/nodes.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import { jsondata } from "./sample.js";

const props = defineProps(["node", "parent"]);

const router = useRouter();
const onDblClick = (node) => {
  router.push({ path: `/nodes/${node.id}` });
  focusing.value = node;
};

const onDelete = () => {
  const node = props.node;
  const parent = node.parent;
  destroy(node);

  if (parent) {
    router.push({ path: `/nodes/${parent.id}` });
  }
};
</script>
<template>
  <div>
    <h2>{{ node.title }}</h2>

    <div style="margin: 1rem 0">
      <span>{{ node.start_date }}</span> ~
      <span>{{ node.end_date }}</span>
    </div>
    <div style="margin: 1rem 0">
      <RouterLink :to="`/nodes/${node.id}/edit`">Edit</RouterLink> &middot;

      <a href="#" @click="onDelete">Delete</a>
    </div>

    <div v-if="!node.isContentBlank" class="content">
      {{ node.content }}
    </div>

    <NodeList
      :list="node.children"
      :parent="node"
      :appendable="true"
      @click="(node) => (focusing = node)"
      @dblclick="onDblClick"
    >
      <InlineForm :parent="node"></InlineForm>
    </NodeList>

    <template v-if="false">
      <div>This is a testing of a vue excel editor</div>
      <vue-excel-editor v-model="jsondata" filter-row />
    </template>
  </div>
</template>

<style scoped>
.content {
  background: #efefef;
  padding: 0.5rem;
  margin-bottom: 1rem;
  white-space: pre;
}
</style>
