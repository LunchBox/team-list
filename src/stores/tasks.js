import { ref, watch, computed } from "vue";
import randomId from "@/utils/random_id.js";
import Task from "@/models/task.js";

// TODO: move to other place
const currentUser = ref("daniel");

const taskList = ref([]);

const editing = ref(null);

const currentTask = ref(null);

const save = (data, parent = null) => {
  const container = parent ? parent.children : taskList.value;

  if (!data.id) {
    const task = Object.assign(new Task(), data);
    task.user = currentUser.value;
    task.id = randomId();
    container.push(task);
  } else if (editing.value?.id === data.id) {
    Object.assign(editing.value, data);
  }
};

// ---- store & load
watch(
  taskList,
  () => {
    localStorage.setItem("tl-data", JSON.stringify(taskList.value));
  },
  { deep: true }
);
const load = () => {
  const ds = localStorage.getItem("tl-data");
  if (typeof ds === "string") {
    taskList.value = JSON.parse(ds).map((str) =>
      Object.assign(new Task(), str)
    );
  }
};
load();

export { taskList, editing, currentTask, currentUser, save };
