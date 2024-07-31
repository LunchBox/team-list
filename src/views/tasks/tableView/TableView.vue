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

      <div class="a-list">
        <div class="a-table">
          <div class="th"></div>
          <div class="th"></div>
          <div class="th">Content</div>
          <div class="th">Start Date</div>
          <div class="th">End Date</div>

          <TableRow v-for="c in item.children" :item="c"></TableRow>
        </div>
      </div>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
