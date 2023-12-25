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

const { fetchRooms } = useRoomStore();
const { fetchChats } = useChatStore();
const { currentRoom } = storeToRefs(useRoomStore());
const { chats } = storeToRefs(useChatStore());

const fetchData = async () => {
  await fetchRooms();
  await fetchChats(currentRoom.value.id);
};
fetchData();
</script>
