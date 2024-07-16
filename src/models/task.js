export default class Task {
  user = null;
  content = null;
  expend = false;
  children = [];

  loadAttributes(attr) {
    Object.assign(this, attr);
    this.loadChildren();
    return this;
  }

  loadChildren() {
    if (!this.children) {
      this.children = [];
      return;
    }

    this.children = this.children.map((attr) => {
      if (attr instanceof Task) {
        return attr;
      } else {
        return new Task().loadAttributes(attr);
      }
    });
  }

  collapseAll() {
    this.expend = false;
    console.log(this.children);
    this.children?.forEach((ct) => ct.collapseAll());
  }

  expandAll() {
    this.expend = true;
    this.children?.forEach((ct) => ct.expandAll());
  }
}
