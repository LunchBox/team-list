import useLocalStorage from "./useLocalStorage";

import Task from "./task.js";

export default class Project {
  name = null;

  get tasks() {
    return Task.filterByProject(this.id);
  }
}

useLocalStorage("tl/projects", Project);
