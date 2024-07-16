import { ref, watch, computed } from "vue";
import randomId from "@/utils/random_id.js";

const REPLACER = (key, value) => {
  return key.startsWith("_") || key.startsWith("$") ? undefined : value;
};

const bySeq = (a, b) => a.seq - b.seq;

const last = (arr) => arr[arr.length - 1];

// TODO: move to other place
const currentUser = ref("daniel");

const taskList = ref([]);
const rootTasks = computed(() =>
  taskList.value.filter((t) => !t.parentId).sort(bySeq)
);

const editing = ref(null);
const focusing = ref(null);

// ---- Model
class Task {
  title = null;
  content = null;
  parentId = null;
  seq = 0;

  // ---- filters

  get parent() {
    return taskList.value.find((t) => t.id === this.parentId);
  }

  get children() {
    return taskList.value.filter((t) => t.parentId === this.id).sort(bySeq);
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  get allChildrenLen() {
    return this.children
      .map((t) => t.allChildrenLen)
      .reduce((sum, c) => sum + c, this.children.length ?? 0);
  }

  // under the same parents
  get siblings() {
    return (this.parent ? this.parent.children : rootTasks.value).sort(bySeq);
  }

  get restSiblings() {
    return this.siblings.filter((t) => t.seq > this.seq);
  }

  get prev() {
    return last(this.siblings.filter((t) => t.seq < this.seq));
  }

  get maxChildSeq() {
    return last(this.children)?.seq ?? -1;
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
    // no id, create
    if (!this.id) {
      this.user = currentUser.value;
      this.id = randomId(16);

      // assign seq
      const collection = this.parent ? this.parent.children : rootTasks.value;
      const lastSeq = last(collection)?.seq ?? -1;
      this.seq = lastSeq + 1;

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

  // 如果有前一個 node 就用前一個 node 做 parent
  // 沒有就新增一個
  const middle =
    task.prev ??
    Object.assign(new Task(), {
      title: "N/A",
      parentId: parent?.id,
    }).save();

  // 將自己移到前一個 node 的最末尾
  task.parentId = middle.id;
  task.seq = middle.maxChildSeq + 1;

  // 展開方便查看
  if (parent) parent.expand = true;
};

const decreaseIndent = (task) => {
  if (!confirm("Are you sure?")) return false;

  const parent = task.parent;

  if (parent) {
    const grandPa = parent.parent;

    // 和 parent 同級剩下的 items 向後排
    parent.restSiblings.forEach((t) => (t.seq += 1));

    // 和自己同級剩下的 items 變成自己的 children
    const offset = task.maxChildSeq;
    task.restSiblings.forEach((t) => {
      t.parentId = task.id;
      t.seq += offset + 1;
    });

    // 將自身移到 parent 的後一個
    task.parentId = grandPa?.id;
    task.seq = parent.seq + 1;

    // 展開方便查看
    task.expand = true;
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
