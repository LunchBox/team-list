<script setup>
import { computed } from "vue";
import ListItem from "./ListItem.vue";

import TableRow from "./TableRow.vue";

const props = defineProps(["item", "indent"]);

const indent = computed(() => {
  return props.indent ?? 0;
});
</script>
<template>
  <div class="center">{{ indent }}</div>
  <div>
    <RouterLink :to="`/tasks/${item.id}/table`" class="focus-marker">
      Details
    </RouterLink>
  </div>
  <div>
    <span class="nowrap">{{ item.start_date }}</span>
  </div>
  <div>
    <span class="nowrap">{{ item.end_date }}</span>
  </div>

  <div>
    <ListItem :item="item" :indent="indent"></ListItem>
  </div>

  <TableRow
    v-if="item.exp"
    v-for="c in item.children"
    :item="c"
    :indent="indent + 1"
  ></TableRow>
</template>

<style scoped></style>
