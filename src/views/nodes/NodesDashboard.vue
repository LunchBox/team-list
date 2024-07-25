<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";

import NodesAside from "./NodesAside.vue";

const hideAside = ref(false);
</script>

<template>
  <div class="flex" :class="{ separated: !hideAside }" @click.stop>
    <aside v-if="!hideAside">
      <NodesAside></NodesAside>
      <div><a href="#" @click.prevent="hideAside = true">Hide</a></div>
    </aside>
    <main>
      <RouterView />
    </main>
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
</style>
