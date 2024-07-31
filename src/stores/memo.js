import useLocalStorage from "./shared/useLocalStorage";

import NestSortable from "./shared/nest_sortable";

export default class Memo extends NestSortable {
  content = null;
  taskId = null;

  constructor() {
    super();
  }

  toString() {
    return this.content;
  }
}

useLocalStorage("tl/memos", Task);
