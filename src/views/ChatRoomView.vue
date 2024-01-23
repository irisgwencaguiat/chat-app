<template>
  <UserRooms />
  <Chats />
</template>

<script setup>
import { useRoomStore } from '../stores/room';
import { useChatStore } from '../stores/chat';

import UserRooms from '../components/UserRooms.vue';
import Chats from '../components/Chats.vue';
import { storeToRefs } from 'pinia';
import { onMounted, onUpdated } from 'vue';

const { fetchRooms, updateRoomList } = useRoomStore();
const { fetchChats, insertChat } = useChatStore();
const { currentRoom } = storeToRefs(useRoomStore());
const { chats } = storeToRefs(useChatStore());
import { watch } from 'vue';

// console.log(window.Echo.channel('room-2'));
const currentUser = JSON.parse(localStorage.getItem('user'));
// console.log(currentUser);
window.Echo.channel(`user.room.${currentUser.id}`).listen(
  '.last-read-at-update',
  (event) => {
    console.log(event);
  }
);

window.Echo.channel(`latest.room.user.${currentUser.id}`).listen(
  '.latest-room',
  (event) => {
    updateRoomList(JSON.parse(event.room));
  }
);
watch(
  () => currentRoom.value.id,
  (newRoom, oldRoom) => {
    console.log(`Count changed from ${oldRoom} to ${newRoom}`);
    window.Echo.channel(`room.${newRoom}`).listen('.message', (event) => {
      console.log('chat room channel');
      insertChat(event.message);
    });
  }
);
const fetchData = async () => {
  await fetchRooms();
  await fetchChats(currentRoom.value.id);

  // console.log('test');
  // console.log(window.Echo.channel(`room-${currentRoom.value.id}`));
  // Echo.channel(`room-${currentRoom.value.id}`).listen('message', (event) => {
  //   // chats.value.push(event.message.);
  //   console.log(event.message);
  // });
  // window.Echo.channel('room.1').listen('.message', (event) => {
  //   console.log('working na');
  //   console.log(event.message);
  //   chats.value.push(event.message);
  // });
};

fetchData();
onUpdated(async () => {
  await fetchData();
});
</script>
