import ActiveRecord from "./active_record";

export default class Task extends ActiveRecord {
  static STORAGE_KEY = "tl/tasks";

  name = null;
  start_date = null;
  end_date = null;
}

console.log(Task);
