import { defineStore } from 'pinia';
import axios from 'axios';

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [],
  }),
  actions: {
    async fetchChats(roomId) {
      const result = await axios.get(`/rooms/${roomId}`);
      this.chats = result.data.data.chats;
    },
    async insertChat(message) {
      this.chats.unshift(message);
    },
    async createChat({ roomId, message }) {
      const result = await axios.post(`/chats`, {
        message: message,
        room_id: roomId,
      });
      console.log(result.data);
    },
  },
});
