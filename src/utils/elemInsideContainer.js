const elemInsideContainer = (el, container) => {
  if (el === container) return true;
  if (el.parentNode) return elemInsideContainer(el.parentNode, container);
  return false;
};

export default elemInsideContainer;
