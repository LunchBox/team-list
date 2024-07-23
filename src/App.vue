<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

import AppAside from "./views/AppAside.vue";

const hideAside = ref(false);
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

  <div class="flex" :class="{ separated: !hideAside }" @click.stop>
    <aside v-if="!hideAside">
      <AppAside></AppAside>
      <div><a href="#" @click.prevent="hideAside = true">Hide</a></div>
    </aside>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
aside {
  border-right: 1px solid #eee;
}

main {
  flex: 1;
  max-width: 100%;
  padding: 0 1rem;
  min-height: 80vh;
}

.separated {
  aside {
    flex: 0 0 25%;
  }
  main {
    max-width: 75%;
  }
}
</style>
<style>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

/* list item related */
.a-list {
  position: relative;
  line-height: 1.6rem;

  /* left padding except the root list */
  .a-list {
    padding-left: 2rem;

    /* display left border except the root list */
    &:before {
      content: " ";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 3rem;
      width: 1px;
      background-color: #eee;
    }
  }

  .list-item {
    margin: 2px 0;

    &:hover > .list-item-row .focus-marker,
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
    width: 100%;
    height: 100%;
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
