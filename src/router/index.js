import { createRouter, createWebHistory } from 'vue-router';
import SignUpView from '../views/SignUpView.vue';
import LoginView from '../views/LoginView.vue';
import ChatRoomView from '../views/ChatRoomView.vue';
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-up',
      name: 'signUp',
      component: SignUpView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/chat-room',
      name: 'chatRoom',
      component: ChatRoomView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  axios.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem(
    'token'
  )}`;

  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: '/login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
