<script setup>
import { useRouter } from "vue-router";
import { destroy } from "@/stores/nodes.js";

defineProps(["node"]);

const router = useRouter();

const onDelete = () => {
  const node = props.node;
  const parent = node.parent;
  destroy(node);

  if (parent) {
    router.push({ path: `/nodes/${parent.id}` });
  }
};
</script>
<template>
  <div>
    <h2>{{ node.content }}</h2>

    <div class="toolbar">
      <span>{{ node.start_date }}</span> ~
      <span>{{ node.end_date }}</span> &middot;
      <RouterLink :to="`/nodes/${node.id}/edit`">Edit</RouterLink> &middot; view
      as: <a href="#" @click.prevent="node.viewType = null">default</a> &middot;
      <a href="#" @click.prevent="node.viewType = 'gantt'">gantt</a> &middot;
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
