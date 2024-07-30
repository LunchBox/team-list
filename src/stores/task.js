import useLocalStorage from "./useLocalStorage";
import { formatDate } from "@/utils/dates";

import NestSortable from "./nest_sortable.js";

export default class Task extends NestSortable {
  name = null;
  desc = null;
  // parentId = null;
  // seq = 0;
  // exp = false;

  start_date = null;
  end_date = null;
  noDateDrag = false; // just not allow to use drag & drop to adjust start & end date
  done_at = null;

  toString() {
    return this.name;
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

  get isDone() {
    return this.done_at;
  }

  set isDone(val) {
    this.done_at = val && new Date();
  }

  // should be processing
  get isProcessing() {
    if (!this.start_date || !this.end_date) return false;
    const today = formatDate(new Date());
    return !this.done_at && today > this.start_date && today < this.end_date;
  }

  // it is done but over the end_date
  get isLate() {
    if (!this.end_date) return false;
    return this.done_at && this.done_at > this.end_date;
  }

  // it is not done
  get isOverdue() {
    if (!this.end_date) return false;

    return !this.done_at && formatDate(new Date()) > this.end_date;
  }

  // check a node's parent parent path
  inScope(parent) {
    if (this.parent && this.parent === parent) return true;
    return this.parent && this.parent.inScope(parent);
  }

  destroy() {
    // cascading children destroy first
    this.children.forEach((c) => c.destroy());

    Task.remove(this.id);
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
    return Task.save(this);
  }
}

useLocalStorage("tl/tasks", Task);
