<script setup>
import { focusing, appendMode, quickEdit, selection } from "@/stores/nodes.js";

import MarkedText from "@/components/MarkedText.vue";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";
import ExpandMarker from "./ExpandMarker.vue";

const props = defineProps(["node", "parent", "appendable", "draggable"]);
const emit = defineEmits(["item-mousedown", "item-clicked", "dblclick"]);

const { select, toggleSelect, hasSelected } = selection;

defineOptions({
  inheritAttrs: false,
});

const onNodeClicked = (e) => {
  const node = props.node;

  focusing.value = node;

  if (e.ctrlKey) {
    toggleSelect(node);
  } else {
    select(node);
  }

  emit("item-clicked", e, node);
};
</script>
<template>
  <!-- editing mode -->
  <InlineForm
    v-if="quickEdit && focusing === node"
    :node="node"
    style="border: 1px solid #ccc"
    @after-submit="quickEdit = false"
  ></InlineForm>
  <!-- display mode -->
  <div
    v-else
    v-bind="$attrs"
    class="list-item"
    :class="{ focusing: focusing === node, selected: hasSelected(node) }"
  >
    <div
      class="list-item-row flex items-center"
      :draggable="draggable"
      @mousedown="$emit('item-mousedown', $event, node)"
      @click.left.prevent="onNodeClicked"
    >
      <div class="list-item-cell">
        <RouterLink :to="`/nodes/${node.id}`" class="focus-marker">
          <img src="@/assets/arrow-right.svg" alt="focus" />
        </RouterLink>
      </div>

      <template v-if="node.isChildrenBlank">
        <span class="list-item-marker">-</span>

        <MarkedText
          class="node-content full"
          :text="node.content"
          @dblclick="$emit('dblclick', node)"
        ></MarkedText>
      </template>
      <template v-else>
        <ExpandMarker :node="node"></ExpandMarker>
        <a
          href="#"
          class="node-content full"
          @dblclick="$emit('dblclick', node)"
        >
          {{ node.content }}
        </a>
        <span class="child-info">
          ({{ node.children.length }} : {{ node.allChildrenLen }})
        </span>
      </template>
      <span class="seq-info">{{ node.seq }}</span>
    </div>

    <NodeList
      v-if="node.exp"
      :list="node.children"
      :parent="node"
      @item-clicked="(e, node) => $emit('item-clicked', e, node)"
      @dblclick="(node) => $emit('dblclick', node)"
    ></NodeList>
  </div>
  <!-- appending mode, append contents after focusing item -->
  <InlineForm
    v-if="appendable && appendMode && focusing === node"
    :parent="focusing.parent"
    :seq="focusing.seq"
  ></InlineForm>
</template>

<style scoped>
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
</style>
