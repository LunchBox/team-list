<script setup>
import { ref } from "vue";

import MarkedText from "@/components/MarkedText.vue";

import InlineForm from "./InlineForm.vue";

const props = defineProps(["item"]);

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
    :item="item"
    style="outline: 1px solid #ccc"
    @after-submit="afterQuickEdit"
  ></InlineForm>

  <!-- display mode -->
  <div v-else v-bind="$attrs" class="list-item">
    <div class="list-item-row flex items-center">
      <span class="list-item-marker">-</span>
      <MarkedText
        class="item-content full"
        :text="item.name"
        @dblclick="onDoubleClick"
      ></MarkedText>

      <template v-if="!item.isChildrenBlank">
        <span class="child-info">
          ({{ item.children.length }} : {{ item.allChildrenLen }})
        </span>
      </template>
      <span class="seq-info">{{ item.seq }}</span>
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
