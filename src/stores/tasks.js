import { ref, watch, computed } from "vue";
import randomId from "@/utils/random_id.js";

const REPLACER = (key, value) => {
  return key.startsWith("_") || key.startsWith("$") ? undefined : value;
};

// TODO: move to other place
const currentUser = ref("daniel");

const taskList = ref([]);
const rootTasks = computed(() => taskList.value.filter((t) => !t.parentId));

const editing = ref(null);
const focusing = ref(null);

// ---- Model
class Task {
  title = null;
  content = null;
  parentId = null;

  // ---- filters

  get parent() {
    return taskList.value.find((t) => t.id === this.parentId);
  }

  get children() {
    return taskList.value.filter((t) => t.parentId === this.id);
  }

  get allChildrenLen() {
    return this.children
      .map((t) => t.allChildrenLen)
      .reduce((sum, c) => sum + c, this.children.length ?? 0);
  }

  // ---- collapse & expend

  collapse() {
    this.expend = false;
    this.children.forEach((t) => t.collapse());
  }

  expand() {
    this.expend = true;
    this.children.forEach((t) => t.expand());
  }

  // create & update
  save() {
    if (!this.id) {
      this.user = currentUser.value;
      this.id = randomId(16);
      taskList.value.push(this);
      return this;
    } else {
      const t = find(this.id);
      if (t) Object.assign(t, this);
      return t;
    }
  }
}

// ---- filters

const find = (id) => taskList.value.find((t) => t.id === id);

// ---- collapse & expend

const collapseAll = () => taskList.value.forEach((t) => t.collapse());

const expandAll = () => taskList.value.forEach((t) => t.expand());

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
    taskList.value = JSON.parse(ds).map((attrs) =>
      Object.assign(new Task(), attrs)
    );
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

  editing.value = null;
  focusing.value = null;
};

// ---- increase / decrease indent

const increaseIndent = (task) => {
  if (!confirm("Are you sure?")) return false;

  const parent = task.parent;

  const middle = Object.assign(new Task(), {
    title: "N/A",
    parentId: parent?.id,
  }).save();

  Object.assign(task, { parentId: middle.id }).save();
};

const decreaseIndent = (task) => {
  if (!confirm("Are you sure?")) return false;

  const parent = task.parent;

  if (parent) {
    Object.assign(task, { parentId: parent?.parent?.id }).save();
  }
};

export {
  Task,
  taskList,
  rootTasks,
  editing,
  focusing,
  currentUser,
  collapseAll,
  expandAll,
  destroy,
  increaseIndent,
  decreaseIndent,
};
