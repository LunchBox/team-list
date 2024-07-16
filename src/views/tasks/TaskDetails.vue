<script setup>
import { editing, destroy } from "@/stores/tasks.js";

defineProps(["task", "parent"]);
</script>
<template>
  <div>
    <h2>{{ task.title }}</h2>
    <div style="margin: 1rem 0">
      <a href="#" @click.prevent="editing = task">Edit</a> &middot;

      <a href="#" @click="destroy(task)">Delete</a>
    </div>
    <div>
      {{ task.content }}
    </div>
  </div>
</template>
