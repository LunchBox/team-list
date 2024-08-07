<script setup>
import { useRouter } from "vue-router";

import Task from "@/stores/task.js";
// import { destroy } from "@/stores/nodes.js";

const props = defineProps(["item"]);

const router = useRouter();

const onDelete = () => {
  const item = props.item;
  const parent = item.parent;
  if (!confirm(`Are you sure to delete [${item.toString()}]?`)) return;

  item.destroy();

  if (parent) {
    router.push({ path: `/tasks/${parent.id}` });
  }
};
</script>
<template>
  <div>
    <h2>{{ item.name }}</h2>

    <div class="toolbar">
      <span>{{ item.start_date }}</span> ~
      <span>{{ item.end_date }}</span> &middot;
      <RouterLink :to="`/tasks/${item.id}`">default</RouterLink> &middot;
      <!-- <RouterLink :to="`/nodes/${node.id}/dual`">dual</RouterLink> &middot; -->
      <RouterLink :to="`/tasks/${item.id}/gantt`">gantt</RouterLink> &middot;
      <RouterLink :to="`/tasks/${item.id}/table`">table</RouterLink> &middot;
      <RouterLink :to="`/tasks/${item.id}/edit`">Edit</RouterLink> &middot;
      <slot></slot>

      <a href="#" @click.prevent="onDelete" style="color: #999">Delete</a>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  font-size: smaller;
  margin: 1rem 0;
}
</style>
