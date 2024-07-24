import { ref, computed, watch } from "vue";
import { offsetDate, daysDiff } from "@/utils/dates.js";

const firstDayOffset = 3; // display from at least 3 days from firstday or today
const lastDayOffset = 10;

export default (props, defaultDay) => {
  // default 3 days ago
  const startDate = ref(offsetDate(defaultDay, -firstDayOffset));

  const minStart = computed(() => {
    const listStartDates = props.list
      .filter((item) => item.start_date)
      .map((item) => new Date(item.start_date));

    if (listStartDates.length === 0) return defaultDay;

    return Math.min(...listStartDates);
  });

  const maxEnd = computed(() => {
    const listEndDates = props.list
      .filter((item) => item.end_date)
      .map((item) => new Date(item.end_date));

    if (listEndDates.length === 0) return defaultDay;

    return Math.max(...listEndDates);
  });

  const totalDays = computed(() => {
    const firstDay = startDate.value;
    let days = Math.ceil(daysDiff(maxEnd.value, firstDay));

    // at least display 30 days
    return Math.max(days, 30) + firstDayOffset + lastDayOffset;
  });

  // update start date if any item changed the minimun start date
  watch(
    minStart,
    () => {
      if (!minStart.value) return;
      const fd = Math.min(minStart.value, new Date());
      startDate.value = offsetDate(fd, -3);
    },
    { immediate: true }
  );

  const dates = computed(() => {
    const firstDay = startDate.value;
    const days = totalDays.value;

    return [...Array(days)].map((_, i) => {
      return offsetDate(firstDay, i);
    });
  });

  return {
    startDate,
    totalDays,
    dates,
  };
};
