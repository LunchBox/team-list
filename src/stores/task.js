import useLocalStorage from "./useLocalStorage";

export default class Task {
  name = null;

  est_start_date = null;
  est_end_date = null;

  done_at = null;
  start_at = null;
  end_at = null;
}

useLocalStorage("tl/tasks", Task);
