import { ref, watch } from "vue";
import { REPLACER } from "./utils";
import CusArray from "@/utils/cus_array";

import randomId from "@/utils/random_id.js";

export default (storageKey, modelClass) => {
  const store = ref(new CusArray());

  const dumpJSON = () => {
    return JSON.stringify(store.value, REPLACER);
  };

  const saveToStorage = () => {
    localStorage.setItem(storageKey, dumpJSON());
  };

  const find = (id) => {
    return store.value.find((t) => t.id === id);
  };

  const all = () => {
    return store.value;
  };

  // -- save & load store
  const loadJSON = (jsonData) => {
    store.value = new CusArray(
      ...JSON.parse(jsonData).map((attrs) =>
        Object.assign(new modelClass(), attrs)
      )
    );
  };

  const load = () => {
    const data = localStorage.getItem(storageKey);
    if (typeof data === "string") loadJSON(data);
  };
  load();

  watch(store, () => saveToStorage(), { deep: true });

  // create & update
  const save = (obj) => {
    if (!obj instanceof modelClass) {
      throw new Error(`object not instance of ${modelClass}`);
    }

    // no id, create
    if (!obj.id) {
      obj.id = randomId(16);

      store.value.push(obj);

      return obj;
    } else {
      const t = find(obj.id);

      if (t) Object.assign(t, obj);
      return t;
    }
  };

  const classMethods = { find, all };
  const instanceMethods = [save];
  const regMethodsToModel = () => {
    Object.assign(modelClass, classMethods);

    instanceMethods.forEach((f) => {
      modelClass.prototype[f.name] = function () {
        f(this);
      };
    });
  };
  regMethodsToModel();
};