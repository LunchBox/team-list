// ---- move up/down

const moveUp = (item) => {
  if (!item.prev) return;

  const seq = item.prev.seq;
  item.prev.seq = item.seq;
  item.seq = seq;
};

const moveDown = (item) => {
  if (!item.next) return;

  const seq = item.next.seq;
  item.next.seq = item.seq;
  item.seq = seq;
};

// ---- increase / decrease indent
const increaseIndent = (item) => {
  const parent = item.parent;

  // 如果有前一個 node 就用前一個 node 做 parent
  // 沒有就新增一個
  const middle =
    item.prev ??
    Object.assign(new item.constructor(), {
      name: "N/A",
      parentId: parent?.id,
    }).save();

  // 將自己移到前一個 node 的最末尾
  item.parentId = middle.id;
  item.seq = middle.maxChildSeq + 1;

  // 展開方便查看
  item.parent?.expand();
};

const decreaseIndent = (item, scopeRef = null) => {
  const parent = item.parent;

  // scope is a node, do not allow children excape the scope
  if (parent && parent === scopeRef?.value) return;

  if (parent) {
    const grandPa = parent.parent;

    // 和 parent 同級剩下的 items 向後排
    parent.restSiblings.forEach((t) => (t.seq += 1));

    // 和自己同級剩下的 items 變成自己的 children
    const offset = item.maxChildSeq;
    item.restSiblings.forEach((t) => {
      t.parentId = item.id;
      t.seq += offset + 1;
    });

    // 將自身移到 parent 的後一個
    item.parentId = grandPa?.id;
    item.seq = parent.seq + 1;

    // 展開方便查看
    item.expand();
  }
};

// ---- move
const moveToAfter = (fromItem, toItem) => {
  if (fromItem === toItem) return;

  toItem.restSiblings.forEach((n) => (n.seq += 1));
  fromItem.seq = toItem.seq + 1;

  fromItem.parent?.reSeq();
};

export { moveUp, moveDown, increaseIndent, decreaseIndent, moveToAfter };
