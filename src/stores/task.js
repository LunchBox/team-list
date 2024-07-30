import useLocalStorage from "./useLocalStorage";

import Project from "./project.js";

const bySeq = (a, b) => a.seq - b.seq;

const first = (arr) => arr[0];
const last = (arr) => arr[arr.length - 1];

export default class Task {
  name = null;
  projectId = null;
  parentId = null;
  seq = 0;

  exp = false;

  start_date = null;
  end_date = null;
  noDateDrag = false; // just not allow to use drag & drop to adjust start & end date
  done_at = null;

  get project() {
    return Project.find((proj) => proj.id === this.projectId);
  }

  static filterByProject(projectId) {
    return Task.where((obj) => obj.projectId === projectId).sort(bySeq);
  }

  get parent() {
    return Task.find((t) => t.id === this.parentId);
  }

  get children() {
    return Task.where((obj) => obj.parentId === this.id).sort(bySeq);
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
    return (this.parent ? this.parent.children : this.project.tasks.value).sort(
      bySeq
    );
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

  // min & max child dates
  nestedDates(key, type) {
    const minmax = this.children.map((c) => c.nestedDates(key, type));
    minmax.push(this[key]);
    return minmax[type];
  }

  get minChildStartDate() {
    return this.nestedDates("start_date", "min");
  }

  get maxChildEndDate() {
    return this.nestedDates("end_date", "max");
  }

  // ----
  get isChildrenBlank() {
    return this.children?.length === 0;
  }

  get isTask() {
    return this.contentType === "Task";
  }

  get isDone() {
    return this.isTask && this.done_at;
  }

  set isDone(val) {
    this.done_at = val && new Date();
  }

  // should be processing
  get isProcessing() {
    if (!this.isTask || !this.start_date || !this.end_date) return false;
    const today = formatDate(new Date());
    return !this.done_at && today > this.start_date && today < this.end_date;
  }

  // it is done but over the end_date
  get isLate() {
    if (!this.isTask || !this.end_date) return false;
    return this.done_at && this.done_at > this.end_date;
  }

  // it is not done
  get isOverdue() {
    if (!this.isTask || !this.end_date) return false;

    return !this.done_at && formatDate(new Date()) > this.end_date;
  }

  // check a node's parent parent path
  inScope(parent) {
    if (this.parent && this.parent === parent) return true;
    return this.parent && this.parent.inScope(parent);
  }

  // ---- path, for breadcrumbs
  getPath(arr = []) {
    arr.unshift(this);
    if (this.parent) {
      this.parent.getPath(arr);
    }
    return arr;
  }

  getExpanedChildren(contentType = "any", arr = []) {
    this.children.forEach((c) => {
      if (c.contentType !== contentType && contentType !== "any") return;

      arr.push(c);
      if (c.exp) {
        c.getExpanedChildren(contentType, arr);
      }
    });
    return arr;
  }

  get expandedChildren() {
    return this.getExpanedChildren();
  }

  get expandedChildTasks() {
    return this.getExpanedChildren("Task");
  }

  // ---- move
  moveToAfter(item) {
    if (this === item) return;

    item.restSiblings.forEach((n) => (n.seq += 1));
    this.seq = item.seq + 1;

    this.parent?.reSeq();
  }

  reSeq() {
    this.children.forEach((n, i) => (n.seq = i));
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

  // -- static

  // ---- collapse & expend
  static collapseAll() {
    this.all().forEach((t) => t.collapse());
  }

  static expandAll() {
    this.all().forEach((t) => t.expand());
  }

  static destroy(item) {
    if (!confirm(`Are you sure to delete [ ${item.name} ] and its children?`))
      return false;

    item.destroy();
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
      Object.assign(new Task(), {
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

useLocalStorage("tl/tasks", Task);
