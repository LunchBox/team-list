export const REPLACER = (key, value) => {
  return key.startsWith("_") || key.startsWith("$") ? undefined : value;
};
