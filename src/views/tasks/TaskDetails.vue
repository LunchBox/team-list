<script setup>
defineProps(["task", "parent"]);
</script>
<template>
  <div>
    <h2>{{ task.title }}</h2>
    <div>
      <a href="#">Edit</a>
    </div>
    <div>
      {{ task.content }}
    </div>
  </div>
</template>
