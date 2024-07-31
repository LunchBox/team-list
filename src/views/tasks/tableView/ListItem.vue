<script setup>
import { ref, computed } from "vue";

import MarkedText from "@/components/MarkedText.vue";

import ExpandMarker from "@/views/nested_view/ExpandMarker.vue";
import InlineForm from "../InlineForm.vue";
import CheckBox from "../CheckBox.vue";

import useEventListener from "@/utils/useEventListener.js";
import { elemInForm } from "@/utils/elemInsideContainer.js";

const props = defineProps(["item", "indent"]);

const emit = defineEmits(["item-clicked", "item-dblclick"]);

const selected = computed(() => props.selection?.hasSelected(props.item));

defineOptions({
  inheritAttrs: false,
});

const onItemClicked = (e) => {
  emit("item-clicked", e, props.item);
};

// ---- quick edit
const quickEdit = ref(false);
useEventListener(document, "keydown", (e) => {
  if (!props.activated) return;
  if (!selected.value) return;
  if (props.appendMode) return;

  if (elemInForm(e.target)) return;

  if (e.key === "i" || e.key === "e") {
    e.preventDefault();
    e.stopPropagation();
    quickEdit.value = true;
  }
});

const afterQuickEdit = () => {
  quickEdit.value = false;
};

const onDoubleClick = (e) => {
  quickEdit.value = true;
  emit("item-dblclick", e, props.item);
};
</script>
<template>
  <!-- editing mode -->
  <InlineForm
    v-if="quickEdit && selected"
    :item="item"
    style="outline: 1px solid #ccc"
    @after-submit="afterQuickEdit"
  ></InlineForm>
  <!-- display mode -->
  <div v-else v-bind="$attrs" class="list-item" :class="{ selected }">
    <div
      class="list-item-row flex items-center"
      ref="itemRowRef"
      @click.left.prevent="onItemClicked"
    >
      <span class="list-item-cell" v-for="i in indent"></span>

      <ExpandMarker :item="item"></ExpandMarker>

      <CheckBox class="list-item-cell" :item="item"></CheckBox>

      <template v-if="item.isChildrenBlank">
        <MarkedText
          class="item-content full"
          :text="item.name"
          @dblclick="onDoubleClick"
        ></MarkedText>
      </template>
      <template v-else>
        <a href="#" class="item-content full" @dblclick="onDoubleClick">
          {{ item }}
        </a>
        <span class="child-info">
          ({{ item.children.length }} : {{ item.allChildrenLen }})
        </span>
      </template>
      <span class="seq-info">{{ item.seq }}</span>
    </div>
  </div>
</template>

<style scoped>
.list-item {
  position: relative;

  &.hover:before {
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 2px solid #ccc;
  }
}

.list-item-row {
  outline: none;
}

.child-info {
  color: #ccc;
  font-style: italic;
  font-size: smaller;
}

.seq-info {
  font-size: smaller;
  color: #ccc;
  padding: 0 0.5rem;
}

.list-item-row:focus {
  outline: 2px solid red;
}
</style>
