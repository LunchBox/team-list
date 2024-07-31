import useLocalStorage from "./shared/useLocalStorage";
import { maxListAttr } from "@/stores/utils";

import { formatDate } from "@/utils/dates";

import NestSortable from "./shared/nest_sortable";

import Memo from "./memo";

const bySeq = (a, b) => a.seq - b.seq;

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

  constructor() {
    super();
  }

  toString() {
    return this.name;
  }

  get memos() {
    return Memo.where((m) => !m.parentId && m.taskId === this.id).sort(bySeq);
  }

  get maxMemoSeq() {
    return maxListAttr(this.memos, "seq");
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
}

useLocalStorage("tl/tasks", Task);
