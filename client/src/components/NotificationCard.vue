<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {{ t('notifiy') }}
      </h3>
      <div class="flex items-center space-x-4">
        <button v-if="notifications.length > 0" @click="markAllAsRead"
          class="text-sm text-sky-500 hover:text-sky-600 dark:hover:text-sky-400">
          {{ t('dismiss') }}
        </button>
      </div>
    </div>

    <!-- Notification List -->
    <div class="max-h-[400px] overflow-y-auto">
      <div v-if="notifications.length === 0" class="p-6 text-center text-gray-500">
        No New notifications
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="notification in notifications" :key="notification._id" :class="[
          'p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          !notification.seen ? 'bg-sky-50 dark:bg-sky-900/20' : ''
        ]">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 mt-1">
              <div class="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                <i class="ri-user-follow-line text-sky-500 dark:text-sky-400"
                  v-if="notification.type === 'follower'"></i>
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
import { ref, computed, onMounted } from 'vue';
import { usePostStoryStore } from '@/stores/homePageStore';
import ToastService from '@/utils/toast.js';
import { useLanguageStore } from '@/stores/languageStore';
const toast = ToastService();


const { t } = useLanguageStore();
const postStoryStore = usePostStoryStore();

const notifications = ref([]);

onMounted(async () => {
  const response = await postStoryStore.getNotifications();
  if (response.error) {
    return;
  }

  notifications.value = response.notifications || []
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

const markAllAsRead = async () => {


  const response = await postStoryStore.markAllAsRead();
  if (response.error) {
    toast.error(response.error || "Unable to Clear");
    return;
  }
  toast.success('Cleared!', { position: 'top-center' });

  notifications.value = response.notifications || []
};

</script>