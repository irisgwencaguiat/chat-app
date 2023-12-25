<template>
  <div class="w-96 bg-white">
    <div class="pt-4 px-4">
      <div class="px-3 flex flex-row justify-between">
        <h1 class="text-2xl font-bold">Chats</h1>
        <i class="fa-solid fa-right-from-bracket text-2xl cursor-pointer"></i>
      </div>

      <div class="flex flex-row">
        <div
          class="flex items-end"
          v-if="!isRoomMode"
          @click="isRoomMode = true"
        >
          <i
            class="flex items-center fa-solid fa-arrow-left rounded-full p-3 hover:rounded-full hover:bg-gray-200"
          ></i>
        </div>
        <div class="relative w-full">
          <i class="absolute left-3 top-5 fa-solid fa-magnifying-glass"></i>
          <input
            id="search-room"
            placeholder="Search Chat Room"
            @click="searchModeOn"
            @keyup="searchUser"
            v-model="searchQuery"
            class="focus:outline-none py-2 pl-9 mt-2 border rounded-2xl w-full bg-gray-100"
          />
        </div>
      </div>

      <div class="pt-4 pb-12 mb-44 h-[85vh]">
        <ul v-if="isRoomMode" class="max-h-full overflow-y-auto">
          <li
            :key="room.id"
            v-for="room in rooms"
            @click="changeRoom(room)"
            class="w-full p-2 rounded hover:bg-gray-100 cursor-pointer flex flex-row"
            :class="[currentRoom.roomId === room.id ? 'bg-gray-100' : '']"
          >
            <h1
              class="text-xl flex items-center justify-center mr-3 w-12 h-12 rounded-full bg-violet-400 text-white"
            >
              {{ room.user_rooms[0].user.first_name.charAt(0)
              }}{{ room.user_rooms[0].user.last_name.charAt(0) }}
            </h1>
            <div>
              <h1 class="font-medium">
                {{ room.user_rooms[0].user.first_name }}
                {{ room.user_rooms[0].user.last_name }}
              </h1>
              <!--              <h1 class="font-medium">{{ room.user_rooms[0].user.first_name }} {{ room.user_rooms[0].user.last_name }}</h1>-->
              <div class="text-gray-500 text-sm flex flex-row">
                <p v-if="currentUser.id === room.latest_chat.user_id">You:</p>
                <p class="pl-1">{{ room.latest_chat.message }}</p>
              </div>
            </div>
          </li>
        </ul>
        <ul v-if="!isRoomMode" class="max-h-full overflow-y-auto">
          <li
            v-for="user in searchResults"
            @click="checkIfRoomExist(user)"
            class="w-full p-2 rounded hover:bg-gray-100 cursor-pointer flex flex-row"
          >
            <!--              :class="[ currentRoom.roomId === room.id ? 'bg-gray-100' : '']">-->
            <!--            <h1 class="flex items-center justify-center mr-3 w-12 h-12 rounded-full bg-violet-400 text-white">IG</h1>-->
            <h1
              class="text-xl flex items-center justify-center mr-3 w-12 h-12 rounded-full bg-violet-400 text-white"
            >
              {{ user.first_name.charAt(0) }}{{ user.last_name.charAt(0) }}
            </h1>
            <div>
              <h1 class="font-medium">
                {{ user.first_name }} {{ user.last_name }}
              </h1>
            </div>
          </li>
          <!--          <li-->
          <!--              class="w-full p-2 rounded hover:bg-gray-100 cursor-pointer flex flex-row">-->

          <!--            <h1 class="flex items-center justify-center mr-3 w-12 h-12 rounded-full bg-violet-400 text-white">IG</h1>-->
          <!--            <div>-->
          <!--              <h1 class="font-medium flex items-center w-12 h-12">redseijuro</h1>-->
          <!--            </div>-->
          <!--          </li>-->
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineEmits, reactive, onUpdated } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useRoomStore } from '../stores/room';
import { useChatStore } from '../stores/chat';

const emit = defineEmits(['non-existent-room']);
const currentUser = JSON.parse(localStorage.getItem('user'));
const isRoomMode = ref(true);
const searchQuery = ref('');
const searchResults = ref(null);

const { updateCurrentRoom, roomIsNotFound } = useRoomStore();
const { fetchChats } = useChatStore();
const { rooms, currentRoom, noRoom, user } = storeToRefs(useRoomStore());

const changeRoom = async (room) => {
  await updateCurrentRoom(room);
  await fetchChats(currentRoom.value.id);
};

const checkIfRoomExist = async (user) => {
  const result = await axios.get(`/rooms/users/${user.id}`);
  if (result.data) {
    await changeRoom(result.data);
    isRoomMode.value = true;
    searchQuery.value = '';
  } else {
    // currentRoom.roomId = 0;
    // currentRoom.userId = user.id;
    // currentRoom.username = `${user.first_name} ${user.last_name}`;
    // emit('current-room', currentRoom);
    // console.log(user.first_name)
    roomIsNotFound(user);
    isRoomMode.value = true;
    searchQuery.value = '';
  }
};

const searchModeOn = () => {
  isRoomMode.value = false;
};

const searchUser = async () => {
  const result = await axios.get(`/users?search=${searchQuery.value}`);
  searchResults.value = result.data.data;
};

const logout = async () => {
  const result = await axios.post('/logout');
  console.log(result);
};
</script>
