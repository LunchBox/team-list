import { ref, watch, computed } from "vue";
import randomId from "@/utils/random_id.js";
import Task from "@/models/task.js";

// TODO: move to other place
const currentUser = ref("daniel");

const taskList = ref([]);

const editing = ref(null);

const collapseAll = () => {
  taskList.value.forEach((t) => t.collapseAll());
};

const expandAll = () => {
  taskList.value.forEach((t) => t.expandAll());
};

// ---- create & update

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
    taskList.value = JSON.parse(ds).map((attr) =>
      new Task().loadAttributes(attr)
    );
  }
};
load();

// ---- delete

const destroy = (task, parent) => {
  const container = parent ? parent.children : taskList.value;

  const idx = container.indexOf(task);
  if (idx > -1) {
    container.splice(idx, 1);
  }
};

export {
  taskList,
  editing,
  currentUser,
  save,
  collapseAll,
  expandAll,
  destroy,
};
