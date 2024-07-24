import { computed, ref } from "vue";

export default function useSelection() {
  const _items = ref(new Set());

  const clear = () => {
    _items.value.clear();
  };

  const toggle = (item) => {
    if (_items.value.has(item)) {
      _items.value.delete(item);
    } else {
      _items.value.add(item);
    }
  };

  // just add a item into the selection
  const add = (item) => {
    _items.value.add(item);
  };

  // clear first then add the item into list
  const select = (item) => {
    clear();
    add(item);
  };

  const toArray = () => {
    return [..._items.value];
  };

  const has = computed((item) => {
    return _items.value.has(item);
  });

  const onlyOne = computed(() => {
    return _items.value.size === 1;
  });

  const any = computed(() => {
    return _items.value.size > 0;
  });

  const first = computed(() => {
    return toArray().shift();
  });

  const last = computed(() => {
    return toArray().pop();
  });

  return {
    onlyOne,
    any,
    first,
    last,
    clear,
    toggle,
    add,
    select,
    has,
  };
}
