<script setup>
import { editing } from "@/stores/tasks.js";

defineProps(["task", "parent"]);
</script>
<template>
  <div>
    <h2>{{ task.title }}</h2>
    <div>
      <a href="#" @click.prevent="editing = task">Edit</a>
    </div>
    <div>
      {{ task.content }}
    </div>
  </div>
</template>
