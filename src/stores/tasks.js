import { ref, watch, computed } from "vue";
import randomId from "@/utils/random_id.js";

const REPLACER = (key, value) => {
  return key.startsWith("_") || key.startsWith("$") ? undefined : value;
};

// TODO: move to other place
const currentUser = ref("daniel");

const taskList = ref([]);
const rootTasks = computed(() => taskList.value.filter((t) => !t._parent));

const editing = ref(null);
const focusing = ref(null);

// ---- filters

const find = (id) => taskList.value.find((t) => t.id === id);

// ---- parent & children

const getParent = (task) => {
  return taskList.value.find((t) => t.id === task.id);
};

const getChildren = (task) => {
  return taskList.value.filter((t) => t.parentId === task.id);
};

// ---- collapse & expend
const collapse = (task) => {
  task.expend = false;
  getChildren(task).forEach(collapse);
};

const collapseAll = () => taskList.value.forEach(collapse);

const expand = (task) => {
  task.expend = true;
  getChildren(task).forEach(expand);
};

const expandAll = () => taskList.value.forEach(expand);

// ---- count all children of a task

const countChildren = (task) => {
  const children = getChildren(task);
  return children
    .map(countChildren)
    .reduce((sum, c) => sum + c, children.length ?? 0);
};

// ---- create & update

const save = (task) => {
  if (!task.id) {
    task.user = currentUser.value;
    task.id = randomId(16);
    taskList.value.push(task);
  } else {
    const t = find(task.id);
    if (t) Object.assign(t, task);
  }
};

// ---- store & load
watch(
  taskList,
  () => {
    localStorage.setItem("tl/tasks", JSON.stringify(taskList.value, REPLACER));
  },
  { deep: true }
);

const load = () => {
  const ds = localStorage.getItem("tl/tasks");
  if (typeof ds === "string") {
    taskList.value = JSON.parse(ds);
  }
};
load();

// ---- delete

const destroy = (task) => {
  if (!confirm("Are you sure?")) return false;

  const idx = taskList.value.findIndex((t) => t.id === task.id);
  if (idx > -1) {
    taskList.value.splice(idx, 1);
  }
};

export {
  taskList,
  rootTasks,
  editing,
  focusing,
  currentUser,
  save,
  getParent,
  getChildren,
  collapseAll,
  expandAll,
  countChildren,
  destroy,
};
