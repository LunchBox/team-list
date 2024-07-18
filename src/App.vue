<script setup>
import { RouterLink, RouterView } from "vue-router";

import TaskDetails from "./views/tasks/TaskDetails.vue";
import TaskForm from "./views/tasks/TaskForm.vue";
import AppAside from "./views/AppAside.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <div class="flex" @click.stop>
    <AppAside></AppAside>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.flex {
  gap: 0 1rem;
}
</style>
<style>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

main {
  flex: 1;
  padding: 0 1rem;
  min-height: 80vh;
  border-left: 1px solid #eee;
}

/* list item related */
.a-list {
  position: relative;
  line-height: 1.5rem;

  /* left padding except the root list */
  .a-list {
    padding-left: 2rem;

    /* display left border except the root list */
    &:before {
      content: " ";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 2rem;
      width: 1px;
      background-color: #eee;
    }
  }

  .list-item {
    margin: 4px 0;

    &.active > .list-item-row:before {
      content: " ";
      width: 26px;
      height: 26px;
      background: url("@/assets/arrow-right.svg") no-repeat center center;

      position: absolute;
      margin-left: calc(-18px);
    }
  }

  .list-item-row {
    position: relative;
    line-height: initial;

    .full {
      flex: 1;
    }
  }

  .list-item-marker {
    display: inline-block;
    width: 2rem;
    text-align: center;
    margin: 0;
    padding: 3px 0;
  }

  .cell {
    padding: 3px;
  }
}
</style>
