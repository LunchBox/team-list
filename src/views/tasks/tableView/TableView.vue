<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Task from "@/stores/task.js";

import Breadcrumbs from "../Breadcrumbs.vue";

import Header from "../Header.vue";

import TableRow from "./TableRow.vue";

const route = useRoute();
const item = computed(() => Task.find(route.params.id));
</script>
<template>
  <div>
    <template v-if="item">
      <Breadcrumbs :item="item"></Breadcrumbs>
      <Header :item="item"></Header>

      <table>
        <tr>
          <th></th>
          <th></th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Content</th>
        </tr>

        <TableRow v-for="c in item.children" :item="c"></TableRow>
      </table>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
