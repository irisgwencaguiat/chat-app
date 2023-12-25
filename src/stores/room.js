import { defineStore } from 'pinia';
import axios from 'axios';

export const useRoomStore = defineStore('room', {
  state: () => ({
    currentRoom: {},
    rooms: [],
    noRoom: false,
    user: {},
  }),
  actions: {
    async fetchRooms() {
      const result = await axios.get('/rooms');
      this.rooms = result.data.data;
      this.currentRoom = this.rooms[0];
    },
    async updateCurrentRoom(currentRoom) {
      this.currentRoom = currentRoom;
    },
    async createRoom(test) {
      const result = await axios.post('/rooms', {
        user_id: this.user.id,
      });
      console.log(result.data);
      console.log(this.user);
      console.log(test);
      this.noRoom = false;
    },
    async roomIsNotFound(user) {
      this.currentRoom = {};
      this.noRoom = true;
      this.user = user;
    },
  },
});
