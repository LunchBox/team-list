import { autoBind } from "@/utils/bind.js";
import {
  focusing,
  increaseIndent,
  decreaseIndent,
  moveUp,
  moveDown,
} from "@/stores/tasks.js";

export default () => {
  autoBind(document, "keydown", (e) => {
    if (!focusing.value) return;
    const ft = focusing.value;

    // 按住 shift 移動
    if (e.shiftKey) {
      e.preventDefault();

      const fs = {
        ArrowUp: () => moveUp(ft),
        ArrowDown: () => moveDown(ft),
        ArrowLeft: () => decreaseIndent(ft),
        ArrowRight: () => increaseIndent(ft),
      };

      fs[e.key]?.();
    } else {
      // 不按 shift 只是移動 focus
      const fs = {
        ArrowUp: () => {
          return (
            (ft.prev && ft.prev.exp && ft.prev.children.last) ||
            ft.prev ||
            ft.parent
          );
        },
        ArrowDown: () => {
          return (ft.exp && ft.children.first) || ft.next || ft.parent?.next;
        },
        ArrowLeft: () => {
          if (focusing.value.exp) {
            focusing.value.collapse();
          } else {
            return ft.parent;
          }
        },
        ArrowRight: () => {
          focusing.value.expand();
        },
      };

      const target = fs[e.key]?.();
      target && (focusing.value = target);
    }
  });
};
