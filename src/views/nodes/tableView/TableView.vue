<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";
import useSelection from "@/utils/useSelection.js";

import Breadcrumbs from "../Breadcrumbs.vue";

import Header from "../Header.vue";

import ListItem from "./ListItem.vue";

const selection = useSelection();

const route = useRoute();
const node = computed(() => find(route.params.id));

const itemList = computed(() => {
  return node.value.getExpanedChildren();
});
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <div class="a-list">
        <template v-for="node in itemList">
          <ListItem :node="node"></ListItem>
          <span>{{ node.start_date }}</span>
          <span>{{ node.end_date }}</span>
        </template>
      </div>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped>
.a-list {
  display: grid;
  grid-template-columns: 1fr 10rem 10rem;
}
</style>
