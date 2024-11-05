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
  <tr>
    <td class="center">{{ indent }}</td>
    <td>
      <RouterLink :to="`/tasks/${item.id}/table`" class="focus-marker">
        Details
      </RouterLink>
    </td>
    <td>
      <span class="nowrap">{{ item.start_date }}</span>
    </td>
    <td>
      <span class="nowrap">{{ item.end_date }}</span>
    </td>

    <td :style="{ '--indent': indent + 'rem' }" class="content-td">
      <ListItem :item="item" :indent="indent"></ListItem>
    </td>
  </tr>

  <TableRow
    v-if="item.exp"
    v-for="c in item.children"
    :item="c"
    :indent="indent + 1"
  ></TableRow>
</template>

<style scoped>
td {
  border: 1px solid #ccc;
  padding: 0 2px;
}
.content-td {
  padding-left: calc(var(--indent) + 0.5rem);
}
</style>
