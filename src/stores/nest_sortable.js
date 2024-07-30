const bySeq = (a, b) => a.seq - b.seq;

const first = (arr) => arr[0];
const last = (arr) => arr[arr.length - 1];

export default class {
  parentId = null;
  seq = 0;
  exp = false;

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

  getExpanedChildren(arr = []) {
    this.children.forEach((c) => {
      arr.push(c);
      if (c.exp) {
        c.getExpanedChildren(arr);
      }
    });
    return arr;
  }

  get expandedChildren() {
    return this.getExpanedChildren();
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

  // ---- move
  moveToAfter(item) {
    if (this === item) return;

    item.restSiblings.forEach((n) => (n.seq += 1));
    this.seq = item.seq + 1;

    this.parent?.reSeq();
  }

  // ---- collapse & expend

  collapse() {
    this.exp = false;
    this.children.forEach((t) => t.collapse());
  }

  expand() {
    this.exp = true;
    this.children.forEach((t) => t.expand());
  }

  // ---- collapse & expend
  static collapseAll() {
    this.all().forEach((t) => t.collapse());
  }

  static expandAll() {
    this.all().forEach((t) => t.expand());
  }
}
