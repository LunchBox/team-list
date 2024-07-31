export const REPLACER = (key, value) => {
  return key.startsWith("_") || key.startsWith("$") ? undefined : value;
};

export const maxListAttr = (list, attr) => {
  const arr = list.map((item) => item[attr]).filter((x) => x);
  // if (arr.length === 0) return -1;
  return arr.sort((a, b) => a - b).last ?? -1;
};
