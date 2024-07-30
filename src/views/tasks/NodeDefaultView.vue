<script setup>
import { computed, toValue, provide } from "vue";
import { useRoute } from "vue-router";
import Task from "@/stores/task.js";
import useSelection from "@/utils/useSelection.js";

import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";

import EditableList from "./EditableList.vue";

const selection = useSelection();
provide("selection", selection);

const route = useRoute();
const item = computed(() => Task.find(route.params.id));
</script>
<template>
  <div>
    <template v-if="item">
      <Breadcrumbs :item="item"></Breadcrumbs>
      <Header :item="item"> </Header>

      <div style="padding-bottom: 80vh">
        <EditableList :parent="item" :list="item.children"></EditableList>
      </div>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped></style>
