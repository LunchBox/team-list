export const REPLACER = (key, value) => {
  return key.startsWith("__") || key.startsWith("$") ? undefined : value;
};

export const maxListAttr = (list, attr) => {
  const arr = list.map((item) => item[attr]);
  return arr.sort((a, b) => a - b).last ?? -1;
};
