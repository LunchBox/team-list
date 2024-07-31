import useLocalStorage from "./shared/useLocalStorage";

import NestSortable from "./shared/nest_sortable";

import Task from "./task";

export default class Memo extends NestSortable {
  content = null;
  taskId = null;

  constructor() {
    super();
  }

  toString() {
    return this.content;
  }

  get task() {
    return Task.find(this.taskId);
  }

  get siblings() {
    return this.parentId ? super.siblings : this.task?.memos;
  }
}

useLocalStorage("tl/memos", Memo);
