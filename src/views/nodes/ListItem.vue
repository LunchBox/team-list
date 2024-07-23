<script setup>
import { focusing, appendMode, quickEdit } from "@/stores/nodes.js";

import NodeList from "./NodeList.vue";
import InlineForm from "./InlineForm.vue";

import MarkedText from "@/components/MarkedText.vue";

const props = defineProps(["node", "parent", "appendable"]);
const emit = defineEmits(["click", "dblclick"]);

defineOptions({
  inheritAttrs: false,
});
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
    :class="{ active: focusing === node }"
  >
    <div class="list-item-row flex items-center">
      <RouterLink :to="`/nodes/${node.id}`" class="list-item-cell">
        <img src="@/assets/arrow-right.svg" alt="focus" class="focus-marker" />
      </RouterLink>
      <template v-if="node.isChildrenBlank">
        <span class="list-item-marker">-</span>

        <MarkedText
          :text="node.content"
          class="full"
          @click.prevent="$emit('click', node)"
          @dblclick="$emit('dblclick', node)"
        ></MarkedText>
      </template>
      <template v-else>
        <a
          href="#"
          class="list-item-marker"
          @click.prevent="node.exp = !node.exp"
        >
          {{ node.exp ? "-" : "+" }}
        </a>
        <a
          href="#"
          class="full"
          @click.prevent="$emit('click', node)"
          @dblclick="$emit('dblclick', node)"
        >
          {{ node.content }}
        </a>
        <span style="color: #ccc; font-style: italic; font-size: smaller">
          ({{ node.children.length }} : {{ node.allChildrenLen }})
        </span>
      </template>
      <span style="font-size: smaller; color: #ccc; padding: 0 0.5rem">{{
        node.seq
      }}</span>
    </div>

    <NodeList
      v-if="node.exp"
      :list="node.children"
      :parent="node"
      @click="(node) => $emit('click', node)"
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
</style>
