import { ref } from "vue";
import { REPLACER } from "./utils";
import CusArray from "@/utils/cus_array";

import randomId from "@/utils/random_id.js";

export default class {
  // override this
  // static STORAGE_KEY = "tl/modelName";

  static store = ref(new CusArray());

  static dumpJSON() {
    return JSON.stringify(this.store.value, REPLACER);
  }

  static saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, this.dumpJSON());
  }

  static find(id) {
    return this.store.value.find((t) => t.id === id);
  }

  static all() {
    return this.store.value;
  }

  // -- save & load

  static loadJSON(jsonData) {
    this.store.value = new CusArray(
      ...JSON.parse(jsonData).map((attrs) => Object.assign(new this(), attrs))
    );
  }

  static load() {
    console.log("storage key: ", this, this.STORAGE_KEY);
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (typeof data === "string") this.loadJSON(data);
  }

  // create & update
  save() {
    // no id, create
    if (!this.id) {
      this.id = randomId(16);

      this.constructor.store.value.push(this);

      return this;
    } else {
      const t = this.constructor.find(this.id);
      if (t) Object.assign(t, this);
      return t;
    }
  }
}
