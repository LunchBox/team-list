import useLocalStorage from "./useLocalStorage";

const bySeq = (a, b) => a.seq - b.seq;

export default class Task {
  name = null;
  parentId = null;
  seq = 0;

  est_start_date = null;
  est_end_date = null;

  done_at = null;
  start_at = null;
  end_at = null;

  static filterByProject(projectId) {
    return Task.where((obj) => obj.projectId === projectId).sort(bySeq);
  }

  get children() {
    return Task.where((obj) => obj.parentId === this.id).sort(bySeq);
  }
}

useLocalStorage("tl/tasks", Task);
