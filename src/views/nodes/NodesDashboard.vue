<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import NodesAside from "./NodesAside.vue";

import {
  expandAll,
  collapseAll,
  saveToFile,
  loadFromFile,
} from "@/stores/nodes.js";
</script>

<template>
  <div>
    <div class="toolbar">
      <RouterLink to="/nodes">Home</RouterLink> &middot;
      <a href="#" @click.prevent="saveToFile">Save As</a> &middot;
      <a href="#" @click.prevent="loadFromFile">Load</a> &middot;
      <a href="#" @click.prevent="expandAll">Expand</a> &middot;
      <a href="#" @click.prevent="collapseAll">Collapse</a>
    </div>
    <div class="flex separated">
      <aside>
        <NodesAside></NodesAside>
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
  margin-bottom: 0.5rem;
}
</style>
