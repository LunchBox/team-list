<script setup>
import { computed } from "vue";

import Project from "@/stores/project.js";

import InlineForm from "./InlineForm.vue";

const items = computed(() => Project.all());
</script>
<template>
  <aside>
    Project List
    <div class="a-list">
      <div class="list-item" v-for="item in items">
        <div class="list-item-row">
          <span class="list-item-cell">-</span>

          <RouterLink :to="`/projects/${item.id}`">
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
      <InlineForm></InlineForm>
    </div>
  </aside>
</template>

<style scoped></style>
