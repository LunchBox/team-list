<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { find } from "@/stores/nodes.js";
import useSelection from "@/utils/useSelection.js";

import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";

import EditableNodeList from "./EditableNodeList.vue";

const selection = useSelection();

const route = useRoute();
const node = computed(() => find(route.params.id));

const router = useRouter();
const onItemClick = (e, node) => {
  router.push({
    name: "vs_nodes",
    params: { id: node.value?.id, sid: node.id },
  });
};
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <div class="flex">
        <aside>
          <EditableNodeList
            :parent="node"
            :list="node.children"
            :selection="selection"
            @item-clicked="onItemClick"
          ></EditableNodeList>
        </aside>
        <main @drop="onDrop" @dragover.prevent>
          <RouterView />
        </main>
      </div>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped>
.node-list {
  padding-bottom: 20vh;

  &.activated {
    outline: 2px solid #222;
  }
}
.node-list:focus {
  outline: 2px solid #ccc;
}

aside {
  flex: 1;
}
main {
  flex: 2;
}
</style>
