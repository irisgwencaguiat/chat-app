<template>
  <div class="border w-screen bg-white flex flex-col">
    <div v-if="!noRoom" class="p-4 border shadow-sm sticky">
      <h1 class="font-medium">
        {{ currentRoom.user_rooms[0].user.first_name }}
        {{ currentRoom.user_rooms[0].user.last_name }}
      </h1>
    </div>
    <div v-if="noRoom" class="p-4 border shadow-sm sticky">
      <h1 class="font-medium">
        {{ user.first_name }}
        {{ user.last_name }}
      </h1>
    </div>
    <div
      ref="chatList"
      class="max-h-screen h-[90vh] overflow-y-scroll flex flex-col-reverse"
    >
      <ul v-if="!noRoom" class="pt-2 flex flex-col-reverse">
        <li
          v-for="chat in chats"
          :id="chat.id"
          :key="chat.id"
          class="pb-1 px-4 flex"
          :class="[currentUser.id === chat.user_id ? 'justify-end' : '']"
        >
          <!--         <p v-if="currentUser.id !== chat.user_id" class="mr-2 p-1 w-8 h-8 flex items-center justify-center text-white bg-violet-400 rounded-full">IG</p>-->
          <p
            class="max-w-[65%] py-1 px-2 rounded-2xl border"
            :class="[
              currentUser.id === chat.user_id
                ? 'bg-violet-500 text-white'
                : 'bg-gray-200',
            ]"
          >
            {{ chat.message }}
          </p>
        </li>
      </ul>
    </div>
    <div class="grid grid-cols-12 flow justify-end">
      <div class="col-span-11">
        <input
          type="text"
          class="bg-gray-100 focus:border-violet-400 focus:outline-none w-full border rounded-2xl m-4 p-2"
          placeholder="Aa"
          v-model="message"
          @keyup.enter="sendMessage"
        />
      </div>
      <div class="col-span-1">
        <button @click="sendMessage" class="w-full py-2 mt-4">
          <i class="text-2xl text-violet-600 fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed, onUpdated } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../stores/room';
import { useChatStore } from '../stores/chat';

const { fetchRooms, createRoom } = useRoomStore();
const { createChat, fetchChats } = useChatStore();
const { currentRoom, noRoom, user } = storeToRefs(useRoomStore());
const { chats } = storeToRefs(useChatStore());
const message = ref('');
const chatList = ref(null);

const currentUser = JSON.parse(localStorage.getItem('user'));

const sendMessage = async () => {
  if (noRoom.value) {
    await createRoom();
    await fetchRooms();
  }

  await createChat({ roomId: currentRoom.value.id, message: message.value });
  await fetchChats(currentRoom.value.id);
  await fetchRooms();
  message.value = '';
};
onUpdated(() => {
  chatList.value.scrollTop = chatList.value.scrollHeight;
});
</script>
