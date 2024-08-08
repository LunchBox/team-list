import { ref, watch } from "vue";
import { REPLACER } from "../utils";
import CusArray from "@/utils/cus_array";

import randomId from "@/utils/random_id.js";

import { createTask, updatedTask } from "@/api/tasks";

const PRIMARY_KEY = "_id";

export default (storageKey, modelClass) => {
  const store = ref(new CusArray());

  // use dynamic this, do not use arrow func
  const merge = function (obj) {
    if (obj instanceof Array) {
      return obj.forEach(merge);
    }

    if (obj instanceof this) {
      const idx = store.value.findIndex(
        (item) => item[PRIMARY_KEY] === obj[PRIMARY_KEY]
      );

      if (idx > -1) store.value.splice(idx, 1, obj);
    }
  };

  // const dumpJSON = () => {
  //   return JSON.stringify(store.value, REPLACER);
  // };

  const saveToStorage = () => {
    // localStorage.setItem(storageKey, dumpJSON());
  };
  // watch(store, () => saveToStorage(), { deep: true });

  const find = (id) => {
    return store.value.find((t) => t.id === id);
  };

  const where = (func) => {
    return store.value.filter(func);
  };

  const all = () => {
    return store.value;
  };

  const remove = (id) => {
    const idx = store.value.findIndex((t) => t.id === id);
    if (idx > -1) {
      store.value.splice(idx, 1);
    }
  };

  // // -- save & load store
  // const loadJSON = (jsonData) => {
  //   store.value = new CusArray(
  //     ...JSON.parse(jsonData).map((attrs) =>
  //       Object.assign(new modelClass(), attrs)
  //     )
  //   );
  // };

  // const load = () => {
  //   const data = localStorage.getItem(storageKey);
  //   if (typeof data === "string") loadJSON(data);
  // };
  // load();

  // // clear All Data
  // const clearAllExisitngData = () => {
  //   store.value = new CusArray();
  // };

  const isNewRecord = (obj) => !obj[PRIMARY_KEY];

  // create & update
  const save = (obj) => {
    if (!obj instanceof modelClass) {
      throw new Error(`object not instance of ${modelClass}`);
    }

    // no id, create
    if (isNewRecord(obj)) {
      //   obj.id = randomId(16);
      //   store.value.push(obj);
      //   return obj;
    } else {
      //   const t = find(obj.id);
      //   if (t) Object.assign(t, obj);
      //   return t;
    }
  };

  // register methods into Model
  Object.assign(modelClass, {
    find,
    where,
    all,
    remove,
    save,
    loadJSON,
    clearAllExisitngData,
  });
};
