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
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 bg-[#e4e4e44f] dark:bg-[#00000010] rounded-lg m-1 overflow-hidden">
              <div @click.stop.prevent="viewRecentMsg(contact)"
                class="w-10 h-10 rounded-full overflow-hidden transform transition-transform duration-200 hover:scale-110">
                <img :src="contact.profile_photo_url || '/default-avatar.png'" alt="avatar"
                  class="w-full h-full object-cover" />
              </div>

              <div class="w-full">
                <div class="flex justify-between  font-semibold ml-3">
                  <router-link :to="`/viewAccount/${contact._id}`"
                    class="text-gray-800 hover:text-sky-500 dark:text-gray-200 dark:hover:text-sky-400">
                    {{ contact.user_name }}
                  </router-link>
                  <div v-if="contact.unreadCount > 0" class="w-6 h-6 bg-blue-600 text-white text-md font-semibold flex items-center justify-center rounded-full 
            dark:bg-blue-400">
                    {{ contact.unreadCount }}
                  </div>
                </div>

                <div v-if="contact.lastMessage"  class="ml-3 flex justify-between relative">
                  <!-- Last Message Content -->
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-64 sm:max-w-76">
                    {{ contact.lastMessage.content }}
                  </div>

                  <!-- Created At -->
                  <div>{{ formatDate(contact.lastMessage.createdAt) }}</div>

                  <!-- Modal for Recent Messages -->
                  <Teleport to="body">
                    <Transition name="fade">
                      <div v-if="activeContact && activeContact._id === contact._id"
                        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full">
                          <h2 class="text-lg font-semibold mb-2 dark:text-white">Peak Message</h2>
                          <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                            <div v-for="message in contact.recentMessages" :key="message.sender" class="flex"
                              :class="[message.isSentByCurrentUser ? 'justify-start' : 'justify-end']">
                              <div class="max-w-xs text-md px-4 py-2 rounded-lg relative group" :class="[
                                message.isSentByCurrentUser ? 'bg-gray-500 text-white' : 'bg-blue-400 text-white',
                                message.isSentByCurrentUser ? '' : 'ml-auto']">
                                {{ message.content }}
                                <div class="text-sm opacity-70 ml-2 flex justify-end">{{ formatTime(message.createdAt)
                                  }}</div>
                              </div>
                            </div>

                          </div>
                          <button @click="closeModal"
                            class="mt-4 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 dark:bg-sky-600">
                            Close
                          </button>
                        </div>
                      </div>
                    </Transition>
                  </Teleport>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat area -->
      <ChatBox v-if="selectedContact" :selected-contact="selectedContact" :selected-chat="selectedChat" :is-mobile="isMobile" :messages="messages"
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
import { useLanguageStore } from '@/stores/languageStore'; import { reactive } from 'vue';

import { io } from 'socket.io-client'; // Import Socket.IO client
import { useAuthStore } from '../../stores/authStore';


const { t } = useLanguageStore();

addIcons(BiSearch, BiSend, BiChatDots, BiPeople, BiPerson, BiSun, BiMoon, BiX, BiArrowLeft);

const activeTab = ref('all')
const searchQuery = ref('')
const isMobile = ref(window.innerWidth < 768)

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const isLoading = ref(true);


const postStoryStore = usePostStoryStore();
const authStore = useAuthStore();

const groups = ref([
  // { id: 'g1', name: 'Work Team', lastMessage: 'Meeting at 3 PM' },
  // { id: 'g2', name: 'Family', lastMessage: 'Mom: Don\'t forget dinner!' },
])

const activeContact = ref(null);

const viewRecentMsg = (contact) => {
  activeContact.value = contact;
};

const closeModal = () => {
  activeContact.value = null;
};



const contacts = ref([])
const chats = ref([])

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const messages = ref([])

const selectedContact = ref(null)
const selectedChat = ref(null)
const newMessage = ref('')

const selectContact = (contact) => {
  console.log(chats)
  selectedChat.value = chats.value.find(chat => 
    chat.participants.some(participant => participant.userId === contact._id)
  );
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
  console.log(filteredContacts)
  return contacts.value.filter(contact =>
    contact.user_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


onMounted(async () => {
  try {
    await postStoryStore.getAllUsersChattedWith();
    await postStoryStore.fetchChats();

    contacts.value = postStoryStore.allUsers;
    chats.value = postStoryStore.chats;
    console.log(postStoryStore.chats)
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
