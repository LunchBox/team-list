<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

import { fetchUserInfo } from "@/api/auth";

const user = ref(null);
fetchUserInfo().then((userInfo) => (user.value = userInfo));
</script>

<template>
  <header>
    <RouterLink to="/">Home</RouterLink> &middot;
    <RouterLink to="/tasks">Tasks</RouterLink> |

    <template v-if="user">
      <span v-if="user">{{ user.login }}</span>
    </template>
    <template v-else>
      <RouterLink to="/auth/register">Register</RouterLink> &middot;
      <RouterLink to="/auth/login">Login</RouterLink>
    </template>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  font-size: smaller;
}
</style>
