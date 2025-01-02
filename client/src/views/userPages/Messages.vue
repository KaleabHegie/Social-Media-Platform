<template>
  <div class="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Top navigation -->
    <div class="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <div class="flex space-x-4">
        <button 
          @click="activeTab = 'groups'" 
          :class="{'text-sky-400 dark:text-blue-400': activeTab === 'groups'}" 
          class="font-semibold flex items-center"
        >
          <v-icon name="bi-people" class="mr-1" />
          Groups
        </button>
        <button 
          @click="activeTab = 'personal'" 
          :class="{'text-sky-400 dark:text-blue-400': activeTab === 'personal'}" 
          class="font-semibold flex items-center"
        >
          <v-icon name="bi-person" class="mr-1" />
          Personal
        </button>
      </div>
      <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <v-icon :name="isDark ? 'bi-sun' : 'bi-moon'" />
      </button>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- Message list (visible on mobile when no chat is selected) -->
      <div v-if="isMobile && !selectedContact" class="w-full bg-gray-50 dark:bg-gray-800 flex flex-col">
        <!-- Search bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="w-full px-10 py-2 bg-white dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <v-icon name="bi-search" class="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <!-- Contact list -->
        <div class="overflow-y-auto flex-1">
          <!-- Display contacts dynamically based on activeTab -->
          <div v-if="activeTab === 'groups'">
            <div
              v-for="group in filteredGroups"
              :key="group.id"
              @click="selectContact(group)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div class="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center text-xl font-bold text-white">
                {{ group.name.charAt(0) }}
              </div>
              <div class="ml-3">
                <p class="font-semibold">{{ group.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ group.lastMessage }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab === 'personal'">
            <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="selectContact(contact)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img :src="contact.avatar" alt="avatar" class="w-12 h-12 rounded-full object-cover" />
              <div class="ml-3">
                <p class="font-semibold">{{ contact.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ contact.lastMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar (visible on desktop) -->
      <div v-if="!isMobile" class="w-1/3 lg:w-1/4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Search bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="w-full px-10 py-2 bg-white dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <v-icon name="bi-search" class="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <!-- Contact list -->
        <div class="overflow-y-auto flex-1">
          <div v-if="activeTab === 'groups'">
            <div
              v-for="group in filteredGroups"
              :key="group.id"
              @click="selectContact(group)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-200 dark:bg-gray-700': selectedContact === group }"
            >
              <div class="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center text-xl font-bold text-white">
                {{ group.name.charAt(0) }}
              </div>
              <div class="ml-3">
                <p class="font-semibold">{{ group.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ group.lastMessage }}</p>
              </div>
            </div>
          </div>
          <div v-else-if="activeTab === 'personal'">
            <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="selectContact(contact)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-200 dark:bg-gray-700': selectedContact === contact }"
            >
              <img :src="contact.avatar" alt="avatar" class="w-12 h-12 rounded-full object-cover" />
              <div class="ml-3">
                <p class="font-semibold">{{ contact.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ contact.lastMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat area -->
      <div :class="{'hidden': isMobile && !selectedContact}" class="flex-1 flex flex-col">
        <template v-if="selectedContact">
          <!-- Chat header -->
          <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
              <button v-if="isMobile" @click="leaveChat" class="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <v-icon name="bi-arrow-left" />
              </button>
              <div v-if="selectedContact.avatar" class="w-10 h-10 rounded-full overflow-hidden">
                <img
                  :src="selectedContact.avatar"
                  alt="avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <div v-else class="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center text-lg font-bold text-white">
                {{ selectedContact.name.charAt(0) }}
              </div>
              <h2 class="ml-3 font-semibold">{{ selectedContact.name }}</h2>
            </div>
            <button v-if="!isMobile" @click="leaveChat" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <v-icon name="bi-x" />
            </button>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            <div v-for="message in messages" :key="message.id" class="flex" :class="{ 'justify-end': message.isSent }">
              <div
                class="max-w-xs px-4 py-2 rounded-lg"
                :class="message.isSent ? 'bg-sky-400 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'"
              >
                {{ message.text }}
              </div>
            </div>
          </div>

          <!-- Message input -->
          <div class="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-400"
            />
            <button
              @click="sendMessage"
              class="ml-2 p-2 rounded-full bg-sky-400 hover:bg-blue-600 text-white"
            >
              <v-icon name="bi-send" />
            </button>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center flex-1 text-center">
            <v-icon name="bi-chat-dots" class="text-4xl text-gray-500 dark:text-gray-400 mb-4" />
            <p class="text-gray-600 dark:text-gray-300">Select a contact to start chatting.</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { BiSearch, BiSend, BiChatDots, BiPeople, BiPerson, BiSun, BiMoon, BiX, BiArrowLeft } from "oh-vue-icons/icons";

addIcons(BiSearch, BiSend, BiChatDots, BiPeople, BiPerson, BiSun, BiMoon, BiX, BiArrowLeft);

const isDark = ref(false)
const activeTab = ref('groups')
const searchQuery = ref('')
const isMobile = ref(window.innerWidth < 768)

const groups = ref([
  { id: 'g1', name: 'Work Team', lastMessage: 'Meeting at 3 PM' },
  { id: 'g2', name: 'Family', lastMessage: 'Mom: Don\'t forget dinner!' },
])

const contacts = ref([
  { id: 1, name: 'John Doe', avatar: '/placeholder.svg?height=48&width=48', lastMessage: 'Hey, how are you?' },
  { id: 2, name: 'Jane Smith', avatar: '/placeholder.svg?height=48&width=48', lastMessage: 'See you tomorrow!' },
  { id: 3, name: 'Bob Johnson', avatar: '/placeholder.svg?height=48&width=48', lastMessage: 'Thanks for your help!' },
])

const messages = ref([
  { id: 1, text: 'Hi there!', isSent: false },
  { id: 2, text: 'Hello! How are you?', isSent: true },
  { id: 3, text: 'I\'m doing great, thanks for asking!', isSent: false },
  { id: 4, text: 'That\'s wonderful to hear!', isSent: true },
])

const selectedContact = ref(null)
const newMessage = ref('')

const selectContact = (contact) => {
  selectedContact.value = contact
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      text: newMessage.value,
      isSent: true,
    })
    newMessage.value = ''
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

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
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Update isMobile on window resize
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})
</script>

<style>
/* Add these styles to your global CSS file or use a style block with scoped attribute */
@media (max-width: 768px) {
  .md\:flex {
    display: flex !important;
  }
  .md\:hidden {
    display: none !important;
  }
}
</style>

