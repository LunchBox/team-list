<script setup>
import { ref } from "vue";

import { registerUser } from "@/api/auth";

const defaultModel = {
  login: null,
  password: null,
};
const formData = ref({ ...defaultModel });

const onSubmit = async () => {
  const { login, password } = formData.value;
  const res = await registerUser(login, password);
  if (res) {
    formData.value = { ...defaultModel };
  }
};
</script>
<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="onSubmit">
      <label>
        <span>Login</span>
        <input type="text" v-model="formData.login" />
      </label>

      <label>
        <span>Password</span>
        <input type="password" v-model="formData.password" />
      </label>

      <div class="action">
        <input type="submit" value="Register" />
      </div>
    </form>
  </div>
</template>

<style scoped>
label {
  display: block;
  margin: 0.5rem 0;
}

label > span {
  display: block;
}
</style>
