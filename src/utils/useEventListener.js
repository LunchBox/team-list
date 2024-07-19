import { onMounted, onUnmounted } from "vue";

const useEventListener = (elem, event, func) => {
  onMounted(() => elem.addEventListener(event, func));
  onUnmounted(() => elem.removeEventListener(event, func));
};

export default useEventListener;
