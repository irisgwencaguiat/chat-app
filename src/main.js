import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import axios from 'axios';
import Echo from 'laravel-echo';
import io from 'socket.io-client';

const pinia = createPinia();
const app = createApp(App);

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';
axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem(
  'token'
)}`;

window.io = io;

window.Echo = new Echo({
  broadcaster: 'socket.io',
  client: io,
  host: window.location.hostname + ':6001', // Use the actual port configured in your Laravel Echo Server
});
// const socket = io(window.location.hostname + ':6001');
// socket.on('room-1:App\\Event\\NewMessageEvent', function (message) {
//   console.log('listening');
// });

// console.log(window.location.hostname + ':6001');
// window.Echo.connector.socket.on('message', (error) => {
//   console.error('Connection error:', error);
// });

// console.log(window.Echo);
// console.log(
//   window.Echo.channel('room-1').listen('message', (event) => {
//     return event;
//   })
// );

app.use(pinia);
app.use(router);

app.mount('#app');
