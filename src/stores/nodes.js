import { ref, watch, computed } from "vue";
import randomId from "@/utils/random_id.js";
import useSelection from "@/utils/useSelection.js";
import CusArray from "@/utils/cus_array";

const REPLACER = (key, value) => {
  return key.startsWith("_") || key.startsWith("$") ? undefined : value;
};

const bySeq = (a, b) => a.seq - b.seq;

const first = (arr) => arr[0];
const last = (arr) => arr[arr.length - 1];

// TODO: move to other place
const currentUser = ref("daniel");

const nodeList = ref(new CusArray());

const rootNodes = computed(() =>
  nodeList.value.filter((t) => !t.parentId).sort(bySeq)
);

const maxRootSeq = computed(() => {
  return rootNodes.value.map((t) => t.seq ?? 0).sort((a, b) => a - b).last;
});

const resetList = () => {
  nodeList.value = new CusArray();
};

// init a global selection
const selection = useSelection();

// ---- Model
class Node {
  content = null;
  parentId = null;
  exp = false;
  seq = 0;

  // task attributes
  start_date = null;
  end_date = null;

  // ---- filters

  get parent() {
    return nodeList.value.find((t) => t.id === this.parentId);
  }

  get children() {
    return nodeList.value.filter((t) => t.parentId === this.id).sort(bySeq);
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  get allChildrenLen() {
    return this.children
      .map((t) => t.allChildrenLen)
      .reduce((sum, c) => sum + c, this.children.length ?? 0);
  }

  // with same parent
  get siblings() {
    return (this.parent ? this.parent.children : rootNodes.value).sort(bySeq);
  }

  get restSiblings() {
    return this.siblings.filter((t) => t.seq > this.seq);
  }

  get prev() {
    return last(this.siblings.filter((t) => t.seq < this.seq));
  }

  get next() {
    return first(this.siblings.filter((t) => t.seq > this.seq));
  }

  get maxChildSeq() {
    return last(this.children)?.seq ?? -1;
  }

  // ----
  get isChildrenBlank() {
    return this.children?.length === 0;
  }

  // ---- path, for breadcrumbs
  getPath(arr = []) {
    arr.unshift(this);
    if (this.parent) {
      this.parent.getPath(arr);
    }
    return arr;
  }

  getExpanedChildren(arr = []) {
    this.children.forEach((c) => {
      arr.push(c);
      if (c.exp) {
        c.getExpanedChildren(arr);
      }
    });
    return arr;
  }

  // ---- collapse & expend

  collapse() {
    this.exp = false;
    this.children.forEach((t) => t.collapse());
  }

  expand() {
    this.exp = true;
    this.children.forEach((t) => t.expand());
  }

  // create & update
  save() {
    // no id, create
    if (!this.id) {
      this.user = currentUser.value;
      this.id = randomId(16);

      // adjust rest siblings by seq
      this.siblings
        .filter((t) => t.seq >= this.seq)
        .forEach((t, i) => {
          t.seq = this.seq + i + 1;
        });

      nodeList.value.push(this);

      // assign seq
      // const collection = this.parent ? this.parent.children : rootNodes.value;
      // const lastSeq = last(collection)?.seq ?? -1;
      // this.seq = lastSeq + 1;

      return this;
    } else {
      const t = find(this.id);
      if (t) Object.assign(t, this);
      return t;
    }
  }

  destroy() {
    // cascading children destroy first
    this.children.forEach((c) => c.destroy());

    const idx = nodeList.value.findIndex((t) => t.id === this.id);
    if (idx > -1) {
      nodeList.value.splice(idx, 1);
    }
  }
}

// ---- filters

const find = (id) => nodeList.value.find((t) => t.id === id);

// ---- collapse & expend

const collapseAll = () => nodeList.value.forEach((t) => t.collapse());

const expandAll = () => nodeList.value.forEach((t) => t.expand());

// ---- store & load
const STORAGE_KEY = "tl/nodes";

const dumpJSON = () => JSON.stringify(nodeList.value, REPLACER);

const saveToStorage = (sKey = STORAGE_KEY) => {
  localStorage.setItem(sKey, dumpJSON());
};

const backup = () => saveToStorage("tl/nodes_backup");

watch(nodeList, () => saveToStorage(), { deep: true });

const loadJSON = (jsonData) => {
  nodeList.value = new CusArray(
    ...JSON.parse(jsonData).map((attrs) => Object.assign(new Node(), attrs))
  );
};

const load = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (typeof data === "string") {
    loadJSON(data);
  }
};
load();

const saveToFile = () => {
  const link = document.createElement("a");

  const file = new Blob([dumpJSON()], { type: "application/json" });
  link.href = URL.createObjectURL(file);
  link.download = "data.smile.json";
  link.click();
  URL.revokeObjectURL(link.href);
};

const loadFromFile = () => {
  const input = document.createElement("input");

  input.type = "file";
  input.addEventListener("change", async () => {
    const [f] = input.files;
    console.log(f);
    const data = await f.text();
    loadJSON(data);

    input.value = null;
  });

  input.click();
};

// ---- delete node and its children

const destroy = (node) => {
  if (!confirm(`Are you sure to delete [ ${node.content} ] and its children?`))
    return false;

  node.destroy();
};

// ---- move up/down

const moveUp = (node) => {
  if (!node.prev) return;

  const seq = node.prev.seq;
  node.prev.seq = node.seq;
  node.seq = seq;
};

const moveDown = (node) => {
  if (!node.next) return;

  const seq = node.next.seq;
  node.next.seq = node.seq;
  node.seq = seq;
};

// ---- increase / decrease indent
const increaseIndent = (node) => {
  const parent = node.parent;

  // 如果有前一個 node 就用前一個 node 做 parent
  // 沒有就新增一個
  const middle =
    node.prev ??
    Object.assign(new Node(), {
      content: "N/A",
      parentId: parent?.id,
    }).save();

  // 將自己移到前一個 node 的最末尾
  node.parentId = middle.id;
  node.seq = middle.maxChildSeq + 1;

  // 展開方便查看
  node.parent?.expand();
};

const decreaseIndent = (node, scopeRef = null) => {
  const parent = node.parent;

  // scope is a node, do not allow children excape the scope
  if (parent && parent === scopeRef?.value) return;

  if (parent) {
    const grandPa = parent.parent;

    // 和 parent 同級剩下的 items 向後排
    parent.restSiblings.forEach((t) => (t.seq += 1));

    // 和自己同級剩下的 items 變成自己的 children
    const offset = node.maxChildSeq;
    node.restSiblings.forEach((t) => {
      t.parentId = node.id;
      t.seq += offset + 1;
    });

    // 將自身移到 parent 的後一個
    node.parentId = grandPa?.id;
    node.seq = parent.seq + 1;

    // 展開方便查看
    node.expand();
  }
};

export {
  Node,
  rootNodes,
  maxRootSeq,
  currentUser,
  selection,
  find,
  collapseAll,
  expandAll,
  destroy,
  increaseIndent,
  decreaseIndent,
  moveUp,
  moveDown,
  resetList,
  backup,
  saveToFile,
  loadFromFile,
};
