import useLocalStorage from "./useLocalStorage";

import Task from "./task.js";

export default class Project {
  name = null;

  get tasks() {
    return Task.filterByProject(this.id);
  }

  get maxChildSeq() {
    return last(this.tasks)?.seq ?? -1;
  }
}

useLocalStorage("tl/projects", Project);
