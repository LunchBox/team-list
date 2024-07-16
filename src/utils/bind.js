import { onUnmounted } from "vue";

const autoBind = (elem, event, func) => {
  elem.addEventListener(event, func);
  onUnmounted(() => {
    elem.removeEventListener(event, func);
  });
};

export { autoBind };
