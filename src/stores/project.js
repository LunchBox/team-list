import useLocalStorage from "./useLocalStorage";

export default class Project {
  name = null;
}

useLocalStorage("tl/projects", Project);
