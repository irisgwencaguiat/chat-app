<template>
  <main
    class="container text-black bg-white rounded-lg shadow-2xl m-auto h-auto w-96 p-4"
  >
    <h1 class="mt-4 text-4xl">Login</h1>
    <div class="mt-4">
      <label for="email" class="text-gray-700">Email</label>
      <input
        type="text"
        v-model="loginQuery.email"
        placeholder="Email"
        id="email"
        class="mt-1 py-2 px-2 w-full border rounder-md focus:outline-none focus:border-violet-400"
      />
    </div>
    <div class="mt-4">
      <label for="password" class="text-gray-700">Password</label>
      <input
        type="password"
        v-model="loginQuery.password"
        placeholder="Password"
        id="password"
        class="mt-1 py-2 px-2 w-full border rounded-md focus:outline-none focus:border-violet-400"
      />
    </div>
    <p
      v-if="loginError"
      class="pt-2 pb-1 px-1 mt-2 border border-red-600 text-red-600 bg-red-100"
    >
      {{ loginErrorMessage }}
    </p>
    <button
      class="border p-2 mt-4 block w-full text-white bg-violet-600"
      @click="login"
    >
      Login
    </button>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const loginError = ref(null);
const loginErrorMessage = ref('');
const loginQuery = reactive({
  email: '',
  password: '',
});

const login = async () => {
  if (loginQuery !== null) {
    try {
      const result = await axios.post('/login', {
        email: loginQuery.email,
        password: loginQuery.password,
      });
      localStorage.setItem('token', result.data.data.access_token);
      localStorage.setItem('user', JSON.stringify(result.data.data.user));

      loginQuery.email = '';
      loginQuery.password = '';
      loginError.value = false;
      // if (localStorage.getItem('user') !== null) {
      //   axios.defaults.headers[
      //     'Authorization'
      //   ] = `Bearer ${localStorage.getItem('token')}`;
      await router.push('/chat-room');
    } catch (err) {
      loginError.value = true;
      loginErrorMessage.value = err.response.data.message;
    }
  }
};
</script>
