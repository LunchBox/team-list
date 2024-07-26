<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import NodesAside from "./NodesAside.vue";

import {
  expandAll,
  collapseAll,
  saveToFile,
  loadFromFile,
  resetList,
} from "@/stores/nodes.js";

const hideAside = ref(false);

const clear = () => {
  if (!confirm("Are you sure?")) return;
  resetList();
};
</script>

<template>
  <div>
    <div>
      <div class="toolbar">
        <a href="#" @click.prevent="saveToFile">Save As</a> &middot;
        <a href="#" @click.prevent="loadFromFile">Load</a> &middot;
        <a href="#" @click.prevent="expandAll">Expand</a> &middot;
        <a href="#" @click.prevent="collapseAll">Collapse</a> &middot;
        <a href="#" @click.prevent="clear">Delete All</a>
      </div>
    </div>
    <div class="flex" :class="{ separated: !hideAside }">
      <aside v-if="!hideAside">
        <NodesAside></NodesAside>
        <div><a href="#" @click.prevent="hideAside = true">Hide</a></div>
      </aside>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
aside {
  border-right: 1px solid #eee;
}

main {
  flex: 1;
  max-width: 100%;
  padding: 0 1rem;
  min-height: 80vh;
}

.separated {
  aside {
    flex: 0 0 25%;
  }
  main {
    max-width: 75%;
  }
}

.toolbar {
  font-size: small;
  margin: 1rem 0;
}
</style>
