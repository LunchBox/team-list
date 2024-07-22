<script setup>
import { RouterLink, RouterView } from "vue-router";

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
    border: 1px solid transparent;

    &.active > .list-item-row .focus-marker {
      display: block;
    }
  }

  .list-item-row {
    position: relative;
    align-items: stretch;
    line-height: var(--base-line-height);

    .full {
      flex: 1;
    }
  }

  .list-item-cell {
    display: inline-block;
    width: 1.6rem;
    height: 1.6rem;
    position: relative;
  }

  .list-item-cell .focus-marker {
    position: absolute;
    top: 0;
    display: none;
  }

  .list-item-marker {
    display: inline-block;
    width: 1.6rem;
    height: 1.6rem;
    line-height: 1.6;
    text-align: center;
    margin: 0;
  }
}
</style>
