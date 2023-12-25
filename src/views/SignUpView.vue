<template>
  <main
    class="container text-black bg-white rounded-lg shadow-2xl m-auto h-auto w-96 p-4"
  >
    <h1 class="mt-4 text-4xl">Sign Up</h1>
    <p class="text-gray-400 pt-1">
      Please fill in this form to create an account!
    </p>

    <div class="mt-4">
      <label for="firstName" class="text-gray-700">First Name</label>
      <input
        type="text"
        v-model="signUpQuery.firstName"
        placeholder="First Name"
        id="firstName"
        class="mt-1 py-2 px-2 w-full border rounded-md focus:outline-none focus:border-violet-400"
      />
    </div>
    <div class="mt-4">
      <label for="lastName" class="text-gray-700">Last Name</label>
      <input
        type="text"
        v-model="signUpQuery.lastName"
        placeholder="Last Name"
        id="lastName"
        class="mt-1 py-2 px-2 w-full border rounded-md focus:outline-none focus:border-violet-400"
      />
    </div>
    <div class="mt-4">
      <label for="email" class="text-gray-700">Email</label>
      <input
        type="text"
        v-model="signUpQuery.email"
        placeholder="Email"
        id="email"
        class="mt-1 py-2 px-2 w-full border rounder-md focus:outline-none focus:border-violet-400"
      />
    </div>
    <div class="mt-4">
      <label for="password" class="text-gray-700">Password</label>
      <input
        type="password"
        v-model="signUpQuery.password"
        placeholder="Password"
        id="password"
        class="mt-1 py-2 px-2 w-full border rounded-md focus:outline-none focus:border-violet-400"
      />
    </div>
    <p
      v-if="signUpError"
      class="pt-2 pb-1 px-1 mt-2 border border-red-600 text-red-600 bg-red-100"
    >
      {{ signUpErrorMessage }}
    </p>
    <button
      class="border p-2 mt-4 block w-full text-white bg-violet-600"
      @click="signUp"
    >
      Sign Up
    </button>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const signUpError = ref(null);
const signUpErrorMessage = ref('');
const signUpQuery = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
});

const signUp = async () => {
  if (signUpQuery !== null) {
    try {
      const result = await axios.post('/sign-up', {
        first_name: signUpQuery.firstName,
        last_name: signUpQuery.lastName,
        email: signUpQuery.email,
        password: signUpQuery.password,
      });
      signUpQuery.firstName = '';
      signUpQuery.lastName = '';
      signUpQuery.email = '';
      signUpQuery.password = '';
      signUpError.value = false;
      localStorage.setItem('token', result.data.data.access_token);
      localStorage.setItem('token', result.data.data.user);
      await router.push('/chat-room');
    } catch (err) {
      signUpError.value = true;
      signUpErrorMessage.value = err.response.data.message;
    }
  }
};
</script>
