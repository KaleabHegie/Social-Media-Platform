<template>
  <div class="flex-1 flex flex-col w-full">
    <template ref="box_id" v-if="selectedContact">
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
          <div v-else class="w-10 h-10 rounded-full overflow-hidden">
            <img src="../assets/avatar.jpg" alt="avatar" class="w-full h-full object-cover" />
          </div>
          <h2 v-if="selectedContact.is_group" class="ml-3 font-semibold">{{ selectedContact.name }}</h2>
          <h2 v-else class="ml-3 font-semibold">{{ selectedContact.user_name }}</h2>
        </div>
        <button v-if="!isMobile" @click="$emit('leave-chat')"
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <v-icon name="bi-x" />
        </button>
      </div>

      <!-- Messages -->
      <div class="MessagingArea flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
        @contextmenu.prevent="showContextMenu">
        <div v-for="message in messages" :key="message.id" class="flex"
          :class="[message.sender._id === currentUserId.id ? 'justify-end' : 'justify-start']">

          <!-- Profile Pic -->
          <div v-if="message.sender?._id != currentUserId.id" class="flex items-center space-x-2 mr-1">
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <img :src="message.sender?.profile_photo_url || '/default-avatar.png'" alt="Avatar"
                class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="max-w-xs text-md px-4 py-2 rounded-lg relative group" :class="[
            message.sender._id === currentUserId.id ? 'bg-sky-400 text-white' : 'bg-gray-500 text-white',
            message.sender === currentUserId ? 'ml-auto' : ''
          ]">
            <h5 v-if="selectedContact.is_group && message.sender._id != currentUserId.id" class="text-xs opacity-70 text-white">{{ message.sender.user_name }}</h5>  
              {{ message.content }}
            <div class="text-sm opacity-70 ml-2  flex justify-end">{{ formatTime(message.updatedAt) }}</div>
          </div>

        </div>
      </div>

      <!-- Message input -->
      <div
        class="p-4 mb-20 sm:mb-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input v-model="localNewMessage" type="text" :placeholder="t('typeMessage')"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePostStoryStore } from '../stores/homePageStore';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '@/stores/languageStore';

import { io } from 'socket.io-client'; // Import socket.io-client

const { t } = useLanguageStore();
const authStore = useAuthStore();
const postStoryStore = usePostStoryStore();
const props = defineProps({
  selectedContact: Object,
  selectedChat: Object,
  isMobile: Boolean,
  messages: Array,
  newMessage: String,
});


const emit = defineEmits(['leave-chat', 'send-message', 'update:new-message']);
let messages = ref([]);
const localNewMessage = computed({
  get: () => props.newMessage,
  set: (value) => emit('update:new-message', value),
});

const currentUserId = authStore.user

const socket = io('http://localhost:5000'); // Connect to your backend server

let data = []
if (props.selectedContact.is_group) {
  data = {
    selectedChat: props.selectedContact._id
  }
}
else {

  data = {
    selectedChat: props.selectedChat._id
  }
}

socket.on('connect', () => {
  socket.emit('room_id', { data: { selectedChatId: data } });
})



socket.on('recive-message', (data) => {
  messages.value.push({
    id: data.messageId, // Use the current length of `messages.value`
    content: data.content,
    isSent: true,
    sender: data.sender,
    updatedAt: new Date(),
  });

  scrollToBottom();
})

const sendMessage = () => {// Logs the current message content

  const messageData = {
    sender: {
      _id: currentUserId?.id
    },
    reciver: props.selectedContact,
    content: props.newMessage,
    date: new Date(),
    selectedChat: props.selectedChat,
    selectedChatId: data
  }

  socket.emit('send-message', messageData)
  messages.value.push({
    id: messages.value.length + 1, // Use the current length of `messages.value`
    content: localNewMessage.value,
    isSent: true,
    sender: messageData.sender,
    updatedAt: new Date(),
  });
  localNewMessage.value = ''; // Clear input after sending

  scrollToBottom();

};


const scrollToBottom = () => {
  const messagingArea = document.querySelector('.MessagingArea');
  if (messagingArea) {
    messagingArea.scrollTop = messagingArea.scrollHeight;
  }
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

let isLoading = true;

const showContextMenu = (event) => {
  event.preventDefault();
  showMenu.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
};

import { watch } from 'vue';

watch(
  () => props.selectedContact,
  async (newContact, oldContact) => {

    messages.value = [];
    if (newContact && newContact._id !== oldContact?._id) {
      // Clear the messages immediately


      if (props.selectedContact.is_group == false) {
        try {
          isLoading = true; // Show the loading state
          await postStoryStore.fetchMessages(newContact._id); // Fetch messages for the new contact
          messages.value = postStoryStore.messages; // Update the messages array
        } catch (error) {
          console.error('Error loading messages:', error);
        } finally {
          isLoading = false; // Hide the loading state
        }
      }
    }
  },
  { immediate: true } // Trigger immediately to handle the initial load
);

// Initialize socket

onMounted(async () => {
  if (typeof props.selectedContact.is_group === "undefined") {
    try {
      await postStoryStore.fetchMessages(props.selectedContact._id);
      messages.value = postStoryStore.messages;  // Assuming fetchMessages updates the store's state
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }
  else {
    try {
      isLoading = true; // Show the loading state
      await postStoryStore.fetchMessagesGroup(props.selectedContact._id); // Fetch messages for the new contact
      messages.value = postStoryStore.messages; // Update the messages array
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      isLoading = false; // Hide the loading state
    }
  }


  document.addEventListener('click', closeContextMenu);
  scrollToBottom();
});


onUnmounted(() => {
  if (socket) {
    socket.off('receiveMessage'); // Unsubscribe to prevent memory leaks
  }
  document.removeEventListener('click', closeContextMenu);
});
</script>
