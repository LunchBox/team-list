import { ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";
import {
  focusing,
  appendMode,
  quickEdit,
  increaseIndent,
  decreaseIndent,
  moveUp,
  moveDown,
  destroy,
} from "@/stores/nodes.js";

export default ({ scopeRef = null } = {}) => {
  const delMark = ref(false);

  useEventListener(document, "keydown", (e) => {
    if (!focusing.value) return;
    const ft = focusing.value;

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      appendMode.value = true;
    }

    if (e.key === "i" || e.key === "e") {
      e.preventDefault();
      e.stopPropagation();
      quickEdit.value = true;
    }

    // double press d to delete a node
    if (e.key === "d") {
      if (delMark.value) {
        delMark.value = false;
        destroy(ft);
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
            // not allow to leave the scope
            if (ft.parent && ft.parent === scopeRef?.value) return;
            return ft.parent;
          }
        },
        ArrowRight: () => {
          focusing.value.expand();
        },
      };

      const target = exec(fs[e.key]);
      target && (focusing.value = target);
    }
  });
};
