<script setup>
import { computed } from "vue";
import { marked } from "marked";

const props = defineProps(["text"]);

const mdContent = computed(() => {
  const res = marked(props.text || "")?.trim();
  if (!res || res === "") {
    return "-";
  } else {
    return res;
  }
});
</script>
<template>
  <div v-html="mdContent" class="marked-content"></div>
</template>

<style scoped>
.marked-content {
  line-height: var(--base-line-height);
}
</style>
