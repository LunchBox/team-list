export const elemInsideContainer = (el, container) => {
  if (el === container) return true;
  if (el.parentNode) return elemInsideContainer(el.parentNode, container);
  return false;
};

export const elemInForm = (el) => {
  if (el.tagName === "FORM") return true;
  if (el.parentNode) return elemInForm(el.parentNode);
  return false;
};
