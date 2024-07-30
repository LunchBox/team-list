import ActiveRecord from "./active_record";

export default class Project extends ActiveRecord {
  static STORAGE_KEY = "tl/projects";

  name = null;
}

console.log(Project);
