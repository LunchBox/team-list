import { computed, ref } from "vue";

import CusArray from "@/utils/cus_array";

export default function useSelection() {
  // const _items = ref(new Set());
  const _items = ref(new CusArray());

  const clearSelection = () => {
    // _items.value.clear();
    _items.value = new CusArray();
  };

  // just add a item into the selection
  const add = (item) => {
    // _items.value.add(item);
    if (!_items.value.includes(item)) _items.value.push(item);
  };

  // clear first then add the item into list
  const select = (...items) => {
    clearSelection();
    items.forEach(add);
  };

  const toggleSelect = (item) => {
    // if (_items.value.has(item)) {
    //   _items.value.delete(item);
    // } else {
    //   _items.value.add(item);
    // }
    const idx = _items.value.indexOf(item);
    if (idx > -1) {
      _items.value.splice(idx, 1);
    } else {
      _items.value.push(item);
    }
  };

  const toArray = () => {
    // return new CusArray(..._items.value);
    return _items.value;
  };

  const selectedItems = computed(toArray);

  const hasSelected = (item) => {
    // return _items.value.has(item);
    return _items.value.includes(item);
  };

  const onlyOne = computed(() => {
    // return _items.value.size === 1;
    return _items.value.length === 1;
  });

  const anySelected = computed(() => {
    // return _items.value.size > 0;
    return _items.value.length > 0;
  });

  const first = computed(() => {
    return toArray().shift();
  });

  const last = computed(() => {
    return toArray().pop();
  });

  const handleSelect = (e, item) => {
    if (!item) return;

    if (e.ctrlKey || e.metaKey) {
      toggleSelect(item);
    } else {
      select(item);
    }
  };

  return {
    onlyOne,
    anySelected,
    first,
    last,
    selectedItems,
    clearSelection,
    select,
    add,
    toggleSelect,
    handleSelect, // handleSelect(e, item), select item base on the event
    hasSelected,
  };
}
