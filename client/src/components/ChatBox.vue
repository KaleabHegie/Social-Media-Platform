<template>
  <div class="flex-1 flex flex-col w-full">
    <template v-if="selectedContact">
      <!-- Chat header -->
      <div
        class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <button v-if="isMobile" @click="$emit('leave-chat')"
            class="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <v-icon name="bi-arrow-left" />
          </button>
          <div v-if="selectedContact.avatar" class="w-10 h-10 rounded-full overflow-hidden">
            <img :src="selectedContact.avatar" alt="avatar" class="w-full h-full object-cover" />
          </div>
          <div v-else
            class="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center text-lg font-bold text-white">
            {{ selectedContact.name.charAt(0) }}
          </div>
          <h2 class="ml-3 font-semibold">{{ selectedContact.name }}</h2>
        </div>
        <button v-if="!isMobile" @click="$emit('leave-chat')"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <v-icon name="bi-x" />
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900" @contextmenu.prevent="showContextMenu">
        <div v-for="message in messages" :key="message.id" class="flex" :class="{ 'justify-end': message.isSent }">
          <div class="max-w-xs px-4 py-2 rounded-lg relative group"
            :class="[
              message.isSent ? 'bg-sky-400 text-white' : 'bg-gray-200 text-gray-900 dark:text-gray-900',
              { 'bg-green-400': !message.isSent && message.sender === 'John Doe',
                'bg-purple-400': !message.isSent && message.sender === 'Jane Smith',
                'bg-yellow-400': !message.isSent && message.sender === 'Bob Johnson' }
            ]">
            <p class="text-xs mb-1" v-if="!message.isSent">{{ message.sender }}</p>
            {{ message.text }}
            <span class="text-xs opacity-50 ml-2">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>

      <!-- Message input -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input
          v-model="localNewMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-400"
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" class="ml-2 p-2 rounded-full bg-sky-400 hover:bg-sky-600 text-white">
          <v-icon name="bi-send" />
        </button>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center justify-center flex-1 text-center">
        <v-icon name="bi-chat-dots" class="text-4xl text-gray-500 dark:text-gray-400 mb-4" />
        <p class="text-gray-600 dark:text-gray-300">Select a chat to start chatting.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { OhVueIcon } from "oh-vue-icons";

const props = defineProps({
  selectedContact: Object,
  isMobile: Boolean,
  messages: Array,
  newMessage: String,
});

const emit = defineEmits(['leave-chat', 'send-message', 'update:new-message']);

const localNewMessage = computed({
  get: () => props.newMessage,
  set: (value) => emit('update:new-message', value)
});

const sendMessage = () => {
  emit('send-message');
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Context menu
const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const selectedMessage = ref(null);

const showContextMenu = (event) => {
  event.preventDefault();
  showMenu.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
};

const closeContextMenu = () => {
  showMenu.value = false;
};

// Preview modal
const showPreview = ref(false);
const previewedMessage = ref(null);

const previewMessage = (message) => {
  previewedMessage.value = message;
  showPreview.value = true;
  closeContextMenu();
};

const closePreview = () => {
  showPreview.value = false;
};

onMounted(() => {
  document.addEventListener('click', closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu);
});
</script>


