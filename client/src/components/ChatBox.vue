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
          <div v-if="selectedContact.profile_photo_url" class="w-10 h-10 rounded-full overflow-hidden">
            <img :src="selectedContact.profile_photo_url" alt="avatar" class="w-full h-full object-cover" />
          </div>
          <div v-else
            class="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center text-lg font-bold text-white">
            {{ selectedContact.user_name[0] }}
          </div>
          <h2 class="ml-3 font-semibold">{{ selectedContact.user_name }}</h2>
        </div>
        <button v-if="!isMobile" @click="$emit('leave-chat')"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <v-icon name="bi-x" />
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
        @contextmenu.prevent="showContextMenu">
        <div v-for="message in messages" :key="message.id" class="flex"
          :class="[message.sender._id === selectedContact._id ? 'justify-end' : 'justify-start']">
          <div class="max-w-xs px-4 py-2 rounded-lg relative group" :class="[ 
            message.sender._id === selectedContact._id ? 'bg-green-400 text-gray-900 dark:text-gray-900' : 'bg-sky-400 text-white',
            message.sender === currentUserId ? 'ml-auto' : ''
          ]">
            {{ message.content }}
            <span class="text-xs opacity-50 ml-2">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>

      <!-- Message input -->
      <div class="p-4 mb-20 sm:mb-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input v-model="localNewMessage" type="text" placeholder="Type a message..."
          class="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-400"
          @keyup.enter="sendMessage" />
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
import { ref,computed, onMounted, onUnmounted } from 'vue';
import { usePostStoryStore } from '../stores/homePageStore';
import { io } from 'socket.io-client'; // Import socket.io-client

const postStoryStore = usePostStoryStore();
const props = defineProps({
  selectedContact: Object,
  isMobile: Boolean,
  messages: Array,
  newMessage: String,
});

const emit = defineEmits(['leave-chat', 'send-message', 'update:new-message']);

const localNewMessage = computed({
  get: () => props.newMessage,
  set: (value) => emit('update:new-message', value),
});

const sendMessage = () => {// Logs the current message content
  emit('send-message', { content: localNewMessage.value,  });
  props.messages.push({
    id: props.messages.length + 1,
    content: localNewMessage.value,
    isSent: true,
    sender: 'You',
    timestamp: new Date(),
  });
  localNewMessage.value = ''; // Clear input after sending
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Context menu handling
const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const closeContextMenu = () => {
  showMenu.value = false;
};
const messages = ref([]);
let isLoading = true;

const showContextMenu = (event) => {
  event.preventDefault();
  showMenu.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
};

// Initialize socket
let socket;
onMounted(async () => {
  try {
    console.log(props.selectedContact._id);
    await postStoryStore.fetchMessages(props.selectedContact._id);
    messages.value = postStoryStore.messages;  // Assuming fetchMessages updates the store's state
  } catch (error) {
    console.error('Error loading messages:', error);
  }

  // Initialize the socket
  socket = io('http://localhost:5000'); // Replace with your actual server URL

  // Listen for incoming messages
  socket.on('receiveMessage', (newMessage) => {
    console.log('Received new message:', newMessage);
    // Add the new message to the message list
    if (newMessage.receiverId === props.selectedContact._id || newMessage.senderId === props.selectedContact._id) {
      messages.value.push(newMessage);  // Add new message to the message list
    }
  });

  document.addEventListener('click', closeContextMenu);
});


onUnmounted(() => {
  if (socket) {
    socket.off('receiveMessage'); // Unsubscribe to prevent memory leaks
  }
  document.removeEventListener('click', closeContextMenu);
});
</script>
