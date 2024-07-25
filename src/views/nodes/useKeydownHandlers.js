import { ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";
import {
  // focusing,
  // appendMode,
  // quickEdit,
  increaseIndent,
  decreaseIndent,
  moveUp,
  moveDown,
  destroy,
} from "@/stores/nodes.js";

export default ({
  scopeRef = null,
  selection = null,
  activated = null,
} = {}) => {
  if (!selection) return;

  const { select, selectedItems, anySelected } = selection;

  const delMark = ref(false);

  const isActivated = () => activated.value;

  useEventListener(document, "keydown", (e) => {
    // 如果未 activate， keydown 不做任何處理
    if (!isActivated()) return;

    // 如果沒有選中任何 item 也不用處理？
    if (!anySelected.value) return;

    const items = selectedItems.value;

    // 是否離開指定的 scope
    const onRootScope = () => {
      if (!scopeRef?.value) return false;

      for (const n in items) {
        if (n.parent && n.parent === scopeRef?.value) {
          return true;
        }
      }
      return false;
    };

    // double press d to delete a node
    if (e.key === "d") {
      if (delMark.value) {
        delMark.value = false;

        const prev = items.first.prev;
        items.forEach(destroy);
        select(prev);
      } else {
        delMark.value = true;
      }
    } else {
      delMark.value = false;
    }

    // arrow to move cursor, shift arrow to move nodes
    const exec = (f) => {
      if (!f) return;

      e.preventDefault();
      e.stopPropagation();
      return f();
    };

    const ft = items.first;

    // 按住 shift 移動
    if (e.shiftKey) {
      const fs = {
        ArrowUp: () => moveUp(ft),
        ArrowDown: () => moveDown(ft),
        ArrowLeft: () => decreaseIndent(ft, scopeRef),
        ArrowRight: () => increaseIndent(ft),
      };

      exec(fs[e.key]);
    } else {
      // 不按 shift 只是移動 focus
      const fs = {
        ArrowUp: () => {
          return (
            (ft.prev && ft.prev.exp && ft.prev.children.last) ||
            ft.prev ||
            (onRootScope() ? ft : ft.parent)
          );
        },
        ArrowDown: () => {
          return (ft.exp && ft.children.first) || ft.next || ft.parent?.next;
        },
        ArrowLeft: () => {
          // there are no requirement for multiple nodes here?
          if (items.length === 1) {
            if (items.first.exp) {
              items.first.collapse();
            } else {
              if (onRootScope()) return;
              return ft.parent;
            }
          }
        },
        ArrowRight: () => {
          // focusing.value.expand();
          items.forEach((n) => n.expand());
        },
      };

      const target = exec(fs[e.key]);
      // target && (focusing.value = target);
      target && select(target);
    }
  });
};
