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



    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showGroupModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{{ t('createGroup') }}</h2>
            <div class="mb-4">
              <label for="groupName" class="block text-sm font-medium text-gray-700 dark:text-gray-400">
                {{ t('groupName') }}
              </label>
              <input id="groupName" v-model="newGroup.name" type="text"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
            </div>
            <ParticipantSelector :users="users" v-model="newGroup.participants" />
            <div class="flex justify-end space-x-2 mt-4">
              <button @click="closeGroupModal"
                class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 transition-colors duration-200">
                {{ t('cancel') }}
              </button>
              <button @click="createGroup"
                class="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 transition-colors duration-200">
                {{ t('createGroup') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="flex flex-1 overflow-hidden">
      <!-- Message list (visible on mobile when no chat is selected) -->
      <div v-if="(isMobile && !selectedContact) || !isMobile"
        class="w-full md:w-1/3 lg:w-1/4 bg-gray-50 dark:bg-gray-800 flex flex-col">
        <!-- Search bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <input v-model="searchQuery" type="text" :placeholder="t('search')"
              class="w-full px-10 py-2 bg-white dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
            <v-icon name="bi-search" class="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <!-- Contact list -->
        <div class="overflow-y-auto flex-1">
          <!-- Display contacts dynamically based on activeTab -->
          <div v-if="activeTab === 'groups' || activeTab === 'all'">
            <div v-if="activeTab === 'groups'" class="m-4 text-2xl">
              <div class="flex justify-between items-center m-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4"> {{ t('createNew') }}</p>
                <button @click="openGroupModal"
                  class="text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200">
                  <v-icon name="bi-plus-lg" class="text-xl" />
                </button>
              </div>
            </div>
            <div v-for="group in filteredGroups" :key="group.id" @click="selectContact(group)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 rounded-lg m-2 shadow-sm transition-all duration-200">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
                {{ group.name[0].toUpperCase() }}
              </div>
              <div class="ml-3 flex-grow">
                <p class="font-semibold text-gray-800 dark:text-gray-200">{{ group.name }}</p>
                
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ group.messages[group.messages.length - 1].content || 'No messages yet'
                  }}</p>
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500">
                {{ formatDate(group.updatedAt) }}
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
                  <div v-if="contact.unreadCount > 0" class="w-6 h-6 bg-sky-600 text-white text-md font-semibold flex items-center justify-center rounded-full 
            dark:bg-sky-400">
                    {{ contact.unreadCount }}
                  </div>
                </div>

                <div v-if="contact.lastMessage" class="ml-3 flex justify-between relative">
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
                          <h2 class="text-lg font-semibold mb-2 dark:text-white"> {{ t('peak') }}</h2>
                          <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                            <div v-for="message in contact.recentMessages" :key="message.sender" class="flex"
                              :class="[message.isSentByCurrentUser ? 'justify-start' : 'justify-end']">
                              <div class="max-w-xs text-md px-4 py-2 rounded-lg relative group" :class="[
                                message.isSentByCurrentUser ? 'bg-gray-500 text-white' : 'bg-sky-400 text-white',
                                message.isSentByCurrentUser ? '' : 'ml-auto']">
                                {{ message.content }}
                                <div class="text-sm opacity-70 ml-2 flex justify-end">{{ formatTime(message.createdAt)
                                  }}</div>
                              </div>
                            </div>

                          </div>
                          <button @click="closeModal"
                            class="mt-4 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 dark:bg-sky-600">
                            {{ t('close') }}
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
      <ChatBox v-if="selectedContact" :selected-contact="selectedContact" :selected-chat="selectedChat"
        :is-mobile="isMobile" :messages="messages" :new-message="newMessage" @leave-chat="leaveChat"
        @send-message="sendMessage" @update:new-message="newMessage = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { BiSearch, BiSend, BiChatDots, BiPeople, BiPerson, BiSun, BiMoon, BiX, BiArrowLeft, BiPlusLg } from "oh-vue-icons/icons";
import ChatBox from '@/components/ChatBox.vue';
import { usePostStoryStore } from '../../stores/homePageStore';
import { useLanguageStore } from '@/stores/languageStore'; import { reactive } from 'vue';
import ParticipantSelector from '@/components/ParticipantSelector.vue';
import { io } from 'socket.io-client'; // Import Socket.IO client
import { useAuthStore } from '../../stores/authStore';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import ToastService from '@/utils/toast.js';
const { t } = useLanguageStore();
const toast = ToastService();


const postStoryStore = usePostStoryStore();
const authStore = useAuthStore();



addIcons(BiSearch, BiSend, BiPlusLg, BiChatDots, BiPeople, BiPerson, BiSun, BiMoon, BiX, BiArrowLeft);


const showGroupModal = ref(false);
const newGroup = ref({
  name: '',
  participantSearch: '',
  participants: []
});

const users = ref([
]);
const selectedUsers = ref([]);




const filteredUsers = computed(() =>
  users.value.filter(user =>
    user.user_name.toLowerCase().includes(newGroup.value.participantSearch.toLowerCase())
  )
);

const openGroupModal = () => {
  showGroupModal.value = true;
};

const closeGroupModal = () => {
  showGroupModal.value = false;
  newGroup.value = { name: '', participantSearch: '', participants: [] };
};

const addParticipant = (user) => {
  if (!newGroup.value.participants.find(participant => participant._id === user._id)) {
    newGroup.value.participants.push(user);
  }
};
const createGroup = async () => {
  if (!newGroup.value.name || newGroup.value.participants.length === 0) {
    toast.error('Group name and at least one participant are required!', { position: 'top-center' });
    return;
  }

  try {
    // Simulate API call
    const response = await postStoryStore.createGroup(newGroup.value)
    if (response.error) {
      toast.error(`Error creating group: ${response.error}`, { position: 'top-center' });
    } else {
      toast.success(`Group Created Successfully!`, { position: 'top-center' });
    }
    closeGroupModal();
  } catch (error) {
    console.error('Error creating group:', error);
  }
};

const activeTab = ref('all')
const searchQuery = ref('')
const isMobile = ref(window.innerWidth < 768)

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const isLoading = ref(true);



const groups = ref([])

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
  selectedChat.value = chats.value.find(chat =>
    !chat.isGroup && // Ensure the chat is not a group
    chat.participants.some(participant => participant.userId === contact._id)
  );
  selectedContact.value = contact;
};

console.log(selectedChat.value)
const currentUserId = authStore.user?.id

const sendMessage = () => {
  if (newMessage.value.trim()) {
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
    await postStoryStore.getAllUsersChattedWith();
    await postStoryStore.fetchChats();
    await postStoryStore.getAllPublicUsers();
    await postStoryStore.getMyGroups();

    contacts.value = postStoryStore.allUsers;
    chats.value = postStoryStore.chats;
    users.value = postStoryStore.allPublicUsers
    groups.value = postStoryStore.allGroups
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

.multiselect-sky-theme {
  --ms-option-bg-selected: theme('colors.sky.100');
  --ms-option-color-selected: theme('colors.sky.800');
  --ms-tag-bg: theme('colors.sky.100');
  --ms-tag-color: theme('colors.sky.800');
  --ms-ring-color: theme('colors.sky.500');
}

.dark .multiselect-sky-theme {
  --ms-option-bg-selected: theme('colors.sky.800');
  --ms-option-color-selected: theme('colors.sky.100');
  --ms-tag-bg: theme('colors.sky.800');
  --ms-tag-color: theme('colors.sky.100');
  --ms-ring-color: theme('colors.sky.400');
}
</style>
