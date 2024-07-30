<script setup>
import { RouterView } from "vue-router";
import NodesAside from "./NodesAside.vue";

import Task from "@/stores/task.js";

// import { nodeList } from "@/stores/nodes.js";
// console.log(nodeList.value);

// const migrate = () => {
//   Task.clearAllExisitngData();
//   const ds = nodeList.value.map((n) => {
//     const {
//       id,
//       parentId,
//       content: name,
//       seq,
//       start_date,
//       end_date,
//       noDateDrag,
//       done_date: done_at,
//     } = n;
//     return {
//       id,
//       parentId,
//       name,
//       seq,
//       start_date,
//       end_date,
//       noDateDrag,
//       done_at,
//     };
//   });
//   Task.loadJSON(JSON.stringify(ds));
// };
</script>

<template>
  <div>
    <div class="toolbar">
      <!-- <a href="#" @click.prevent="saveToFile">Save As</a> &middot;
      <a href="#" @click.prevent="loadFromFile">Load</a> &middot; -->
      <a href="#" @click.prevent="() => Task.expandAll()">Expand</a> &middot;
      <a href="#" @click.prevent="() => Task.collapseAll()">Collapse</a>
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
