<script setup>
import { computed, toValue, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import MarkedText from "@/components/MarkedText.vue";
import Task from "@/stores/task.js";
import useSelection from "@/utils/useSelection.js";

import Breadcrumbs from "./Breadcrumbs.vue";

import Header from "./Header.vue";

import EditableList from "./EditableList.vue";

import EditableMemoList from "../memos/EditableList.vue";

const selection = useSelection();
provide("selection", selection);

const route = useRoute();
const item = computed(() => Task.find(route.params.id));

provide("commentable", item);

const router = useRouter();
const onItemClick = (e, item) => {
  router.push({ name: "task", params: { id: item.id } });
};
</script>
<template>
  <div>
    <template v-if="item">
      <Breadcrumbs :item="item"></Breadcrumbs>
      <Header :item="item"> </Header>

      <div class="item-content">
        <MarkedText :text="item.content"></MarkedText>
      </div>

      <section>
        <h3>Task List</h3>
        <EditableList
          :parent="item"
          :list="item.children"
          @item-clicked="onItemClick"
        ></EditableList>
      </section>

      <section style="padding-bottom: 80vh">
        <h3>Memo List</h3>
        <EditableMemoList :list="item.memos"></EditableMemoList>
      </section>
    </template>
    <div v-else>Not Found...</div>
  </div>
</template>

<style scoped>
section {
  margin: 2rem 0;
}
.item-content {
  padding: 1rem;
  background: #efefef;
  margin-bottom: 1rem;
}
</style>
