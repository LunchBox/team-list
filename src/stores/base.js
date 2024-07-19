import { reactive, computed } from "vue";

const getMethods = (obj) =>
  Object.getOwnPropertyNames(obj).filter(
    (item) => typeof obj[item] === "function"
  );

// convert all methods start with __ to getters
export default class Base {
  constructor() {
    // first layer, dynamic getter to return the ComputedRefImpl
    const obj = new Proxy(this, {
      get(target, prop) {
        const key = `__R__${prop.toString()}`;
        if (key in target) return target[key];
        return target[prop];
      },
    });

    // second layer, reactive obj
    const proxy = reactive(obj);
    proxy.init();
    return proxy;
  }

  init() {
    // Convert all methods starts with `__` to computed object
    getMethods(Object.getPrototypeOf(this)).forEach((fn) => {
      if (!fn.startsWith("__")) return;

      // create a ComputedRefImpl
      this["__R__" + fn.slice(2)] = computed(() => this[fn]());
    });
  }
}
