import { defineStore } from 'pinia';
import axios from 'axios';

export const useRoomStore = defineStore('room', {
  state: () => ({
    currentRoom: {},
    rooms: [],
    noRoom: false,
    user: {},
    userLastReadAt: null,
  }),
  actions: {
    async fetchRooms() {
      const result = await axios.get('/rooms');
      this.rooms = result.data.data;
      console.log(this.rooms);
      this.currentRoom = this.rooms[0];
    },
    async updateCurrentRoom(currentRoom) {
      this.currentRoom = currentRoom;
    },
    async createRoom() {
      const result = await axios.post('/rooms', {
        user_id: this.user.id,
      });
      console.log(result.data);
      console.log(this.user);
      this.noRoom = false;
    },
    async roomIsNotFound(user) {
      this.currentRoom = {};
      this.noRoom = true;
      this.user = user;
    },
    async updateRoomList(event) {
      const roomIndex = this.rooms.findIndex((room) => {
        return room.id === event.id;
      });
      if (roomIndex > -1) {
        const element = this.rooms[roomIndex];
        this.rooms.splice(roomIndex, 1);
        element.updated_at = event.updated_at;
        element.latest_chat = event.latest_chat;
        this.rooms.unshift(element);
      }
    },
    async updateUserRoomLastReadAt() {
      await axios.put(`rooms/users/last-read-at/${this.currentRoom.id}`);
    },
  },
});
