import useLocalStorage from "./shared/useLocalStorage";

import Base from "./base";

export default class DataSource extends Base {
  name = null;
  sourceType = "localStorage";
  sourceKey = null;

  constructor() {
    super();
  }

  toString() {
    return this.name;
  }
}

useLocalStorage("tl/data_source", DataSource);
