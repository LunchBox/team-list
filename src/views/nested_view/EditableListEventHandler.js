import { ref, toValue } from "vue";
import useEventListener from "@/utils/useEventListener.js";
import { elemInForm } from "@/utils/elemInsideContainer.js";

import {
  increaseIndent,
  decreaseIndent,
  moveUp,
  moveDown,
} from "@/stores/shared/move_items";

export default ({
  scopeRef = null,
  selection = null,
  activated = null,
} = {}) => {
  if (!selection) return;

  const {
    select,
    selectedItems,
    anySelected,
    add: appendSelect,
    toggleSelect,
    hasSelected,
  } = selection;

  // const delMark = ref(false);

  useEventListener(document, "keydown", (e) => {
    if (elemInForm(e.target)) return;

    // 如果未 activate， keydown 不做任何處理
    if (!toValue(activated)) return;

    // 如果沒有選中任何 item 也不用處理？
    if (!toValue(anySelected)) return;

    const items = toValue(selectedItems);
    const scope = toValue(scopeRef);

    // Too dangerous, remove this func
    // // double press d to delete a node
    // if (e.key === "d") {
    //   if (delMark.value) {
    //     delMark.value = false;

    //     const fi = items.first;
    //     const nxt = fi.prev || fi.next || fi.parent;

    //     const msg = items.map((i) => i.toString()).join("; ");
    //     if (!confirm(`Are you sure to delete [ ${msg} ] and its children?`))
    //       return false;

    //     items.forEach((item) => item.destroy());
    //     nxt.inScope(scope) && select(nxt);
    //   } else {
    //     delMark.value = true;
    //   }
    // } else {
    //   delMark.value = false;
    // }

    // arrow to move cursor, shift arrow to move nodes
    const exec = (f) => {
      if (!f) return;

      e.preventDefault();
      e.stopPropagation();
      return f();
    };

    const fItem = items.first;

    // 按住 shift 移動
    if (e.altKey) {
      const fs = {
        ArrowUp: () => moveUp(fItem),
        ArrowDown: () => moveDown(fItem),
        ArrowLeft: () => decreaseIndent(fItem, scopeRef),
        ArrowRight: () => increaseIndent(fItem),
      };

      exec(fs[e.key]);
    } else if (e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();

      const fs = {
        ArrowUp: () => items.last?.globalPrev,
        ArrowDown: () => items.last?.globalNext,
      };

      const target = exec(fs[e.key]);

      if (!(target && target.inScope(scope))) return;

      if (items.length > 1 && hasSelected(target)) {
        toggleSelect(items.last);
      } else {
        appendSelect(target);
      }
    } else {
      // 不按 shift 只是移動 focus
      const fs = {
        ArrowUp: () => fItem.globalPrev,
        ArrowDown: () => fItem.globalNext,
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
        ArrowRight: () => items.forEach((n) => n.expand()),
      };

      const target = exec(fs[e.key]);
      target && target.inScope(scope) && select(target);
    }
  });
};
