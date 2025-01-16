<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Top navigation (hide on mobile when chat is selected) -->
    <div v-if="!isMobile || !selectedContact"
      class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <div class="flex space-x-4">
        <button @click="activeTab = 'all'" :class="{ 'text-sky-400 dark:text-sky-400': activeTab === 'all' }"
          class="font-semibold flex items-center">
          <v-icon name="bi-chat-dots" class="mr-1" />
          {{ t('all') }}
        </button>
        <button @click="activeTab = 'personal'" :class="{ 'text-sky-400 dark:text-sky-400': activeTab === 'personal' }"
          class="font-semibold flex items-center">
          <v-icon name="bi-person" class="mr-1" />
          {{ t('personal') }}
        </button>
        <button @click="activeTab = 'groups'" :class="{ 'text-sky-400 dark:text-sky-400': activeTab === 'groups' }"
          class="font-semibold flex items-center">
          <v-icon name="bi-people" class="mr-1" />
          {{ t('group') }}
        </button>
      </div>
    </div>


    <div class="flex flex-1 overflow-hidden">
      <!-- Message list (visible on mobile when no chat is selected) -->
      <div v-if="(isMobile && !selectedContact) || !isMobile"
        class="w-full md:w-1/3 lg:w-1/4 bg-gray-50 dark:bg-gray-800 flex flex-col">
        <!-- Search bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search"
              class="w-full px-10 py-2 bg-white dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
            <v-icon name="bi-search" class="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <!-- Contact list -->
        <div class="overflow-y-auto flex-1">
          <!-- Display contacts dynamically based on activeTab -->
          <div v-if="activeTab === 'groups' || activeTab === 'all'">
            <div v-for="group in filteredGroups" :key="group.id" @click="selectContact(group)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <div
                class="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center text-xl font-bold text-white">
                {{ group.name }}
              </div>
              <div class="ml-3">
                <p class="font-semibold">{{ group.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ group.lastMessage }} </p>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'personal' || activeTab === 'all'">
            <div v-for="contact in filteredContacts" :key="contact.id" @click="selectContact(contact)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              
                <div v-if="contact.profile_photo_url" class="w-10 h-10 rounded-full overflow-hidden">
                  <router-link :to="`/viewAccount/${contact._id}`"
                class="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                  <img :src="contact.profile_photo_url"  class="w-full h-full object-cover" />
                </router-link>
                </div>
                <div v-else class="w-10 h-10 rounded-full overflow-hidden">
                  <router-link :to="`/viewAccount/${contact._id}`"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                  <img src="../../assets/avatar.jpg" alt="avatar" class="w-full h-full object-cover" />
                </router-link>
                </div>
              
              <div class="ml-3">
                <p class="font-semibold">{{ contact.user_name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ contact.lastMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat area -->
      <ChatBox v-if="selectedContact" :selected-contact="selectedContact" :is-mobile="isMobile" :messages="messages"
        :new-message="newMessage" @leave-chat="leaveChat" @send-message="sendMessage"
        @update:new-message="newMessage = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { BiSearch, BiSend, BiChatDots, BiPeople, BiPerson, BiSun, BiMoon, BiX, BiArrowLeft } from "oh-vue-icons/icons";
import ChatBox from '@/components/ChatBox.vue';
import { usePostStoryStore } from '../../stores/homePageStore';
import { useLanguageStore } from '@/stores/languageStore';
import { io } from 'socket.io-client'; // Import Socket.IO client
import { useAuthStore } from '../../stores/authStore';

const socket = io('http://localhost:5000'); // Connect to your backend server
const { t } = useLanguageStore();

addIcons(BiSearch, BiSend, BiChatDots, BiPeople, BiPerson, BiSun, BiMoon, BiX, BiArrowLeft);

const activeTab = ref('all')
const searchQuery = ref('')
const isMobile = ref(window.innerWidth < 768)


const isLoading = ref(true);


const postStoryStore = usePostStoryStore();
const authStore = useAuthStore();

const groups = ref([
  // { id: 'g1', name: 'Work Team', lastMessage: 'Meeting at 3 PM' },
  // { id: 'g2', name: 'Family', lastMessage: 'Mom: Don\'t forget dinner!' },
])

const contacts = ref([])



const messages = ref([])

const selectedContact = ref(null)
const newMessage = ref('')

const selectContact = (contact) => {
  selectedContact.value = contact
}

const currentUserId = authStore.user?.id

const sendMessage = () => {
  if (newMessage.value.trim()) {
    console.log(postStoryStore.currentUser)
    // Emit message data to the backend

    socket.emit('sendMessage', {
      senderId: currentUserId,  // Replace with the current user's ID
      receiverId: selectedContact.value._id,  // The selected contact's ID
      content: newMessage.value,  // The message content
      media: null  // You can add media data if needed
    }, (response) => {
      if (response.success) {
        // If the message is successfully sent, update the messages array
        socket.emit('messageToReceiver', {
          senderId: currentUserId,  // Sender's ID
          receiverId: selectedContact.value._id,  // Receiver's ID
          content: newMessage.value,  // Message content
          media: null,  // Add media data if needed
          timestamp: new Date()  // Timestamp
        });
      } else {
        console.error(response.message);  // Handle failure
      }
    });
  }
};


const leaveChat = () => {
  selectedContact.value = null
}

const filteredGroups = computed(() => {
  return groups.value.filter(group =>
    group.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    group.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredContacts = computed(() => {
  return contacts.value.filter(contact =>
    contact.user_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


onMounted(async () => {
  try {
    await postStoryStore.fetchAllUsers();
    contacts.value = postStoryStore.allUsers;

  } catch (error) {
    console.error("Error loading profile:", error);
  } finally {
    isLoading.value = false;
  }
});

// Update isMobile on window resize
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})
</script>

<style>
@media (max-width: 768px) {
  .md\:flex {
    display: flex !important;
  }

  .md\:hidden {
    display: none !important;
  }
}
</style>
