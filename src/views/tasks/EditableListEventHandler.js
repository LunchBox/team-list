import { ref, toValue } from "vue";
import useEventListener from "@/utils/useEventListener.js";
import { elemInForm } from "@/utils/elemInsideContainer.js";
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

  useEventListener(document, "keydown", (e) => {
    if (elemInForm(e.target)) return;

    // 如果未 activate， keydown 不做任何處理
    if (!toValue(activated)) return;

    // 如果沒有選中任何 item 也不用處理？
    if (!toValue(anySelected)) return;

    const items = toValue(selectedItems);
    const scope = toValue(scopeRef);

    // double press d to delete a node
    if (e.key === "d") {
      if (delMark.value) {
        delMark.value = false;

        const fi = items.first;
        const nxt = fi.prev || fi.next || fi.parent;
        items.forEach(destroy);
        nxt.inScope(scope) && select(nxt);
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
      target && target.inScope(scope) && select(target);
    }
  });
};
