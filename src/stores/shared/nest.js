export default class {
  parentId = null;
  exp = false;

  static get topItems() {
    return this.where((obj) => !obj.parentId);
  }

  get parent() {
    return this.constructor.find(this.parentId);
  }

  get children() {
    return this.constructor.where((obj) => obj.parentId === this.id);
  }

  get isChildrenBlank() {
    return this.children?.length === 0;
  }

  get allChildrenLen() {
    return this.children
      .map((t) => t.allChildrenLen)
      .reduce((sum, c) => sum + c, this.children.length ?? 0);
  }

  get siblings() {
    return this.parent ? this.parent.children : this.constructor.topItems;
  }

  // ---- path, for breadcrumbs
  getPath(arr = []) {
    arr.unshift(this);
    this.parent && this.parent.getPath(arr);
    return arr;
  }

  // ---- collapse & expend
  collapseAll() {
    this.exp = false;
    this.children.forEach((t) => t.collapseAll());
  }

  expandAll() {
    this.exp = true;
    this.children.forEach((t) => t.expandAll());
  }

  // check a node's parent parent path
  inScope(parent) {
    if (this.parent && this.parent === parent) return true;
    return this.parent && this.parent.inScope(parent);
  }

  destroy() {
    // cascading children destroy first
    this.children.forEach((c) => c.destroy());
    this.constructor.remove(this.id);
  }

  // ---- collapse & expend
  static collapseAll() {
    // this.all().forEach((t) => t.collapse());
  }

  static expandAll() {
    // this.all().forEach((t) => t.expand());
  }
}
