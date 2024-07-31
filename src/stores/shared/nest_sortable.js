import { maxListAttr } from "@/stores/utils";

import Nest from "./nest";

const bySeq = (a, b) => a.seq - b.seq;

export default class extends Nest {
  seq = 0;

  constructor() {
    super();
  }

  static get topItems() {
    return super.topItems.sort(bySeq);
  }

  static get maxTopSeq() {
    // return this.topItems.last?.seq ?? -1;
    return maxListAttr(this.topItems, "seq");
  }

  get children() {
    return super.children.sort(bySeq);
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  // with same parent
  get restSiblings() {
    return this.siblings.filter((t) => t.seq > this.seq);
  }

  get prev() {
    return this.siblings.filter((t) => t.seq < this.seq).last;
  }

  // 全局前一個 item， 如果前一個 item 是展開的，則指向展開的 child item 的最後一個 item
  // the recursive opened last child
  get __lastExpChild() {
    const cs = this.children;
    if (cs.length === 0 || !this.exp) return this;
    return cs.last?.__lastExpChild;
  }

  get globalPrev() {
    return (
      (this.prev && this.prev.exp && this.prev.__lastExpChild) ||
      this.prev ||
      this.parent
    );
  }

  get next() {
    return this.siblings.filter((t) => t.seq > this.seq).first;
  }

  get __availableNext() {
    return this.parent?.next || this.parent?.__availableNext;
  }

  get globalNext() {
    return (
      (this.exp && this.children.first) ||
      this.next ||
      this.parent?.next ||
      this.parent?.__availableNext
    );
  }

  get maxChildSeq() {
    return maxListAttr(this.children, "seq");
    // return this.children.last?.seq ?? -1;
  }

  // 把所有展開的 children 放入同一個 array 中，用來做 table 或者 gantt view
  getExpanedChildren(arr = []) {
    this.children.forEach((c) => {
      arr.push(c);
      c.exp && c.getExpanedChildren(arr);
    });
    return arr;
  }

  get expandedChildren() {
    return this.getExpanedChildren();
  }

  // reset children's sequence
  reSeq() {
    this.children.forEach((n, i) => (n.seq = i));
  }

  // create & update
  save() {
    // adjust seq on new item created
    if (!this.id) {
      // adjust rest siblings by seq
      this.siblings
        .filter((t) => t.seq >= this.seq)
        .forEach((t, i) => {
          t.seq = this.seq + i + 1;
        });
    }
    return this.constructor.save(this);
  }
}
