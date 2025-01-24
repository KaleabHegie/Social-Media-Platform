<template>
    <div class="participant-selector ">
      <div class="mb-4">
        <label for="participant-search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ t('selectParticipants') }}
        </label>
        <input
          id="participant-search"
          v-model="searchQuery"
          type="text"
          :placeholder="t('selectParticipants')"
          class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
        <div
          v-for="user in filteredUsers"
          :key="user._id"
          @click="toggleUser(user)"
          class="flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors duration-200"
          :class="[
            isSelected(user)
              ? 'bg-sky-100 dark:bg-sky-800'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          <img
            :src="user.profile_photo_url || '/default-avatar.png'"
            :alt="user.user_name"
            class="w-12 h-12 rounded-full mb-2"
          />
          <span class="text-sm font-medium text-center text-gray-800 dark:text-gray-200">
            {{ user.user_name }}
          </span>
        </div>
      </div>
      <div v-if="selectedParticipants.length > 0" class="mt-4">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('selectParticipants') }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="participant in selectedParticipants"
            :key="participant._id"
            class="bg-sky-100 dark:bg-sky-800 text-sky-800 dark:text-sky-100 px-2 py-1 rounded-full text-sm flex items-center"
          >
            <img
              :src="participant.profile_photo_url || '/default-avatar.png'"
              :alt="participant.user_name"
              class="w-4 h-4 rounded-full mr-1"
            />
            {{ participant.user_name }}
            <button
              @click="toggleUser(participant)"
              class="ml-1 text-sky-600 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-100"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useLanguageStore } from '@/stores/languageStore';
  
  const { t } = useLanguageStore();
  
  const props = defineProps({
    users: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const searchQuery = ref('');
  const selectedParticipants = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const filteredUsers = computed(() => {
    return props.users.filter((user) =>
      user.user_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  const isSelected = (user) => {
    return selectedParticipants.value.some((p) => p._id === user._id);
  };
  
  const toggleUser = (user) => {
    const index = selectedParticipants.value.findIndex((p) => p._id === user._id);
    if (index === -1) {
      selectedParticipants.value = [...selectedParticipants.value, user];
    } else {
      selectedParticipants.value = selectedParticipants.value.filter((p) => p._id !== user._id);
    }
  };
  </script>
  
  