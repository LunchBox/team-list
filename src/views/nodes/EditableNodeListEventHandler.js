import { ref } from "vue";
import useEventListener from "@/utils/useEventListener.js";
import {
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
    // TODO: scale up to all form fields
    if (e.target.tagName === "TEXTAREA") return;

    // 如果未 activate， keydown 不做任何處理
    if (!isActivated()) return;

    // 如果沒有選中任何 item 也不用處理？
    if (!anySelected.value) return;

    const items = selectedItems.value;

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

    const fItem = items.first;

    // 按住 shift 移動
    if (e.shiftKey) {
      const fs = {
        ArrowUp: () => moveUp(fItem),
        ArrowDown: () => moveDown(fItem),
        ArrowLeft: () => decreaseIndent(fItem, scopeRef),
        ArrowRight: () => increaseIndent(fItem),
      };

      exec(fs[e.key]);
    } else {
      // 不按 shift 只是移動 focus
      const fs = {
        ArrowUp: () => {
          return fItem.globalPrev;
        },
        ArrowDown: () => {
          return fItem.globalNext;
        },
        ArrowLeft: () => {
          // there are no requirement for multiple nodes here?
          if (items.length === 1) {
            if (fItem.exp) {
              fItem.collapse();
            } else {
              return fItem.parent;
            }
          }
        },
        ArrowRight: () => {
          items.forEach((n) => n.expand());
        },
      };

      const target = exec(fs[e.key]);
      target && target.inScope(scopeRef?.value) && select(target);
    }
  });
};
