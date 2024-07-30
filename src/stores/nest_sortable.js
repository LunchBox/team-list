const bySeq = (a, b) => a.seq - b.seq;

const first = (arr) => arr[0];
const last = (arr) => arr[arr.length - 1];

export default class {
  parentId = null;
  seq = 0;

  static get topItems() {
    return this.where((obj) => !obj.parentId).sort(bySeq);
  }

  static get maxTopSeq() {
    return last(this.topItems)?.seq ?? -1;
  }

  get parent() {
    return this.constructor.find(this.parentId);
  }

  get children() {
    return this.constructor
      .where((obj) => obj.parentId === this.id)
      .sort(bySeq);
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  get allChildrenLen() {
    return this.children
      .map((t) => t.allChildrenLen)
      .reduce((sum, c) => sum + c, this.children.length ?? 0);
  }

  // with same parent
  get siblings() {
    return (
      this.parent ? this.parent.children : this.constructor.topItems
    ).sort(bySeq);
  }

  get restSiblings() {
    return this.siblings.filter((t) => t.seq > this.seq);
  }

  get prev() {
    return last(this.siblings.filter((t) => t.seq < this.seq));
  }

  // the recursive opened last child
  get lastExpChild() {
    const cs = this.children;
    if (cs.length === 0 || !this.exp) return this;
    return cs.last?.lastExpChild;
  }

  get globalPrev() {
    return (
      (this.prev && this.prev.exp && this.prev.lastExpChild) ||
      this.prev ||
      this.parent
    );
  }

  get next() {
    return first(this.siblings.filter((t) => t.seq > this.seq));
  }

  get availableNext() {
    return this.parent?.next || this.parent?.availableNext;
  }

  get globalNext() {
    return (
      (this.exp && this.children.first) ||
      this.next ||
      this.parent?.next ||
      this.parent?.availableNext
    );
  }

  get maxChildSeq() {
    return last(this.children)?.seq ?? -1;
  }

  // ----
  get isChildrenBlank() {
    return this.children?.length === 0;
  }

  // ---- path, for breadcrumbs
  getPath(arr = []) {
    arr.unshift(this);
    if (this.parent) {
      this.parent.getPath(arr);
    }
    return arr;
  }

  // reset children's sequence
  reSeq() {
    this.children.forEach((n, i) => (n.seq = i));
  }

  // ---- move up/down

  static moveUp(item) {
    if (!item.prev) return;

    const seq = item.prev.seq;
    item.prev.seq = item.seq;
    item.seq = seq;
  }

  static moveDown(item) {
    if (!item.next) return;

    const seq = item.next.seq;
    item.next.seq = item.seq;
    item.seq = seq;
  }

  // ---- increase / decrease indent
  static increaseIndent(item) {
    const parent = item.parent;

    // 如果有前一個 node 就用前一個 node 做 parent
    // 沒有就新增一個
    const middle =
      item.prev ??
      Object.assign(new this(), {
        content: "N/A",
        parentId: parent?.id,
      }).save();

    // 將自己移到前一個 node 的最末尾
    item.parentId = middle.id;
    item.seq = middle.maxChildSeq + 1;

    // 展開方便查看
    item.parent?.expand();
  }

  static decreaseIndent(item, scopeRef = null) {
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
  }
}
