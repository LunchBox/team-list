<script setup>
import { reactive, watch } from "vue";
import { formatDate } from "@/utils/dates.js";

const props = defineProps(["date_range"]);
const emit = defineEmits(["submit"]);

const formData = reactive({
  start_date: null,
  end_date: null,
});

const reloadForm = () => {
  if (!props.date_range) return;

  const { start_date, end_date } = props.date_range;
  formData.start_date = formatDate(start_date ? start_date : new Date());
  formData.end_date = formatDate(end_date ? end_date : new Date());
};

watch(props, reloadForm, {
  immediate: true,
});
</script>
<template>
  <div>
    <form @submit.prevent="$emit('submit', formData)" @keydown.stop>
      From:
      <input type="date" v-model="formData.start_date" />
      To:
      <input type="date" v-model="formData.end_date" />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<style scoped></style>
