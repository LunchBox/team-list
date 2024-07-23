<script setup>
import Header from "./Header.vue";
import GanttView from "@/views/gantt/GanttView.vue";
defineProps(["node"]);
</script>
<template>
  <div>
    <Header :node="node"></Header>

    <GanttView :list="node.children"></GanttView>
  </div>
</template>
