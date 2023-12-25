import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import axios from 'axios';

const pinia = createPinia();
const app = createApp(App);

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem(
  'token'
)}`;

app.use(pinia);
app.use(router);

app.mount('#app');
