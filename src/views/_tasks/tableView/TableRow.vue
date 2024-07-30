<script setup>
import { computed } from "vue";
import ListItem from "./ListItem.vue";

import TableRow from "./TableRow.vue";

const props = defineProps(["node", "indent"]);

const indent = computed(() => {
  return props.indent ?? 0;
});
</script>
<template>
  <tr>
    <td>{{ indent }}</td>
    <td>
      <RouterLink :to="`/nodes/${node.id}/table`" class="focus-marker">
        Details
      </RouterLink>
    </td>
    <td><ListItem :node="node" :indent="indent"></ListItem></td>
    <td>
      <span>{{ node.start_date }}</span>
    </td>
    <td>
      <span>{{ node.end_date }}</span>
    </td>
  </tr>
  <TableRow
    v-if="node.exp"
    v-for="c in node.children"
    :node="c"
    :indent="indent + 1"
  ></TableRow>
</template>

<style scoped>
th,
td {
  padding: 0 4px;
}
</style>
