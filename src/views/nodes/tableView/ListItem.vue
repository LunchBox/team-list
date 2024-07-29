<script setup>
import { ref, computed, toValue } from "vue";

import MarkedText from "@/components/MarkedText.vue";

import InlineForm from "../InlineForm.vue";
import ExpandMarker from "../ExpandMarker.vue";

import useEventListener from "@/utils/useEventListener.js";
import { elemInForm } from "@/utils/elemInsideContainer.js";

const props = defineProps(["node", "indent"]);

const emit = defineEmits(["item-clicked", "item-dblclick"]);

const selected = computed(() => props.selection?.hasSelected(props.node));

defineOptions({
  inheritAttrs: false,
});

const onNodeClicked = (e) => {
  emit("item-clicked", e, props.node);
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
  emit("item-dblclick", e, props.node);
};
</script>
<template>
  <!-- editing mode -->
  <InlineForm
    v-if="quickEdit && selected"
    :node="node"
    style="outline: 1px solid #ccc"
    @after-submit="afterQuickEdit"
  ></InlineForm>
  <!-- display mode -->
  <div v-else v-bind="$attrs" class="list-item" :class="{ selected }">
    <div
      class="list-item-row flex items-center"
      ref="itemRowRef"
      @click.left.prevent="onNodeClicked"
    >
      <span class="list-item-cell" v-for="i in indent"></span>

      <ExpandMarker :node="node"></ExpandMarker>

      <span v-if="node.isTask" class="list-item-cell">
        <input type="checkbox" />
      </span>

      <template v-if="node.isChildrenBlank">
        <MarkedText
          class="node-content full"
          :text="node.content"
          @dblclick="onDoubleClick"
        ></MarkedText>
      </template>
      <template v-else>
        <a href="#" class="node-content full" @dblclick="onDoubleClick">
          {{ node.content }}
        </a>
        <span class="child-info">
          ({{ node.children.length }} : {{ node.allChildrenLen }})
        </span>
      </template>
      <span class="seq-info">{{ node.seq }}</span>
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
