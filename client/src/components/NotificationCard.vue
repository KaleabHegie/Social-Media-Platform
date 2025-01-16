<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Notifications
      </h3>
      <div class="flex items-center space-x-4">
        <button 
          v-if="hasUnread"
          @click="markAllAsRead"
          class="text-sm text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
        >
          Dismiss All
        </button>
        <button
          v-if="showCloseButton"
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Notification List -->
    <div class="max-h-[400px] overflow-y-auto">
      <div v-if="notifications.length === 0" class="p-6 text-center text-gray-500">
        No notifications yet
      </div>
      
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="notification in notifications"
          :key="notification._id"
          :class="[
            'p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
            !notification.seen ? 'bg-sky-50 dark:bg-sky-900/20' : ''
          ]"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 mt-1">
              <div class="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                <i 
                  class="ri-user-follow-line text-sky-500 dark:text-sky-400"
                  v-if="notification.type === 'follower'"
                ></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-gray-100">
                {{ notification.content }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ formatDate(notification.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  showCloseButton: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['close']);

// Simulated notifications data based on the backend structure
const notifications = ref([
  {
    _id: "6786f2f569cf95148732f767",
    type: "follower",
    content: "user1 unfollowed you.",
    seen: false,
    createdAt: "2025-01-14T23:27:49.766Z",
    updatedAt: "2025-01-14T23:27:49.766Z"
  },
  {
    _id: "6786f2b69cf95148732f94d",
    type: "follower",
    content: "user1 started following you.",
    seen: false,
    createdAt: "2025-01-15T00:07:07.331Z",
    updatedAt: "2025-01-15T00:07:07.331Z"
  }
]);

const hasUnread = computed(() => {
  return notifications.value.some(notification => !notification.seen);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const markAllAsRead = () => {
  notifications.value = notifications.value.map(notification => ({
    ...notification,
    seen: true
  }));
};
</script>