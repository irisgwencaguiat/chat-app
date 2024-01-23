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
          class="pb-1 px-4 flex group"
          :class="[
            currentUser.id === chat.user_id ? 'flex flex-row-reverse' : '',
          ]"
        >
          <p
            @mouseenter="showTimestamp(chat.id)"
            @mouseleave="showTimestamp(null)"
            class="max-w-[65%] py-1 px-2 rounded-2xl border"
            :class="[
              currentUser.id === chat.user_id
                ? 'bg-violet-500 text-white'
                : 'bg-gray-200',
            ]"
          >
            {{ chat.message }}
          </p>
          <p
            :id="chat.id"
            v-if="chat.id === toShow"
            class="my-auto p-1 flex items-center justify-center bg-messenger-timestamp-color rounded-lg border text-white"
          >
            {{ formatTimestamp(chat.created_at) }}
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
import moment from 'moment';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../stores/room';
import { useChatStore } from '../stores/chat';

const { fetchRooms, createRoom, updateRoomList } = useRoomStore();
const { createChat, fetchChats } = useChatStore();
const { currentRoom, noRoom, user, rooms } = storeToRefs(useRoomStore());
const { chats } = storeToRefs(useChatStore());
const currentUser = JSON.parse(localStorage.getItem('user'));
const message = ref('');
const chatList = ref(null);
const toShow = ref(null);
let startTime = ref(null);

function formatTimestamp(timestamp) {
  const now = moment();
  const targetMoment = moment(timestamp);

  // Example 1: If the timestamp is within today, show only the time
  if (targetMoment.isSame(now, 'day')) {
    console.log('its today');
    return targetMoment.format('h:mmA');
  }

  // Example 2: If the timestamp is within this week, show the day of the week and time
  if (targetMoment.isSame(now, 'week')) {
    console.log('its within this week');
    return targetMoment.format('dddd h:mmA');
  }

  // Example 3: If the timestamp is beyond this week, show the month, day, year, and time
  return targetMoment.format('MMMM D, YYYY [at] h:mma');
}
const showTimestamp = (chatId) => {
  if (chatId === null) {
    clearTimeout(startTime);
    toShow.value = null;
  } else {
    startTime = setTimeout(() => {
      toShow.value = chatId;
    }, 200);
  }
};

const sendMessage = async () => {
  if (noRoom.value) {
    await createRoom();
    await fetchRooms();
  }
  await createChat({ roomId: currentRoom.value.id, message: message.value });
  message.value = '';
};

onUpdated(() => {
  chatList.value.scrollTop = chatList.value.scrollHeight;
});
</script>
