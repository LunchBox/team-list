<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { find } from "@/stores/nodes.js";

import Breadcrumbs from "../Breadcrumbs.vue";

import Header from "../Header.vue";

import TableRow from "./TableRow.vue";

const route = useRoute();
const node = computed(() => find(route.params.id));
</script>
<template>
  <div>
    <template v-if="node">
      <Breadcrumbs :node="node"></Breadcrumbs>
      <Header :node="node"></Header>

      <div class="a-list">
        <table class="a-table" border="1">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Content</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            <TableRow v-for="c in node.children" :node="c"></TableRow>
          </tbody>
        </table>
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

.a-table {
  border-collapse: collapse;

  th {
    font-weight: bold;
    text-align: left;
    padding: 0 4px;
  }
}
</style>
