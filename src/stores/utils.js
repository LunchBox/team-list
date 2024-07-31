export const REPLACER = (key, value) => {
  return key.startsWith("_") || key.startsWith("$") ? undefined : value;
};

export const maxListAttr = (list, attr) => {
  return (
    list
      .map((item) => item[attr])
      .filter((x) => x)
      .sort().last ?? -1
  );
};
