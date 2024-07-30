<script setup>
import { ref } from "vue";

import MarkedText from "@/components/MarkedText.vue";

import InlineForm from "./InlineForm.vue";

const props = defineProps(["node"]);

defineOptions({
  inheritAttrs: false,
});

// ---- quick edit
const quickEdit = ref(false);

const afterQuickEdit = () => {
  quickEdit.value = false;
};

const onDoubleClick = (e) => {
  quickEdit.value = true;
};
</script>
<template>
  <!-- editing mode -->
  <InlineForm
    v-if="quickEdit"
    :node="node"
    style="outline: 1px solid #ccc"
    @after-submit="afterQuickEdit"
  ></InlineForm>

  <!-- display mode -->
  <div v-else v-bind="$attrs" class="list-item">
    <div class="list-item-row flex items-center">
      <span class="list-item-marker">-</span>
      <MarkedText
        class="node-content full"
        :text="node.content"
        @dblclick="onDoubleClick"
      ></MarkedText>

      <template v-if="!node.isChildrenBlank">
        <span class="child-info">
          ({{ node.children.length }} : {{ node.allChildrenLen }})
        </span>
      </template>
      <span class="seq-info">{{ node.seq }}</span>
    </div>
  </div>
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

.list-item-row:focus {
  outline: 2px solid red;
}
</style>
