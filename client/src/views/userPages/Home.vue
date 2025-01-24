<template>
  <main class="h-full pt-4 pb-20 px-4 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:space-x-8">
        <!-- Main content area -->
        <div class="flex-grow order-2 lg:order-1">

          <!-- Loading State for Stories -->
          <div v-if="postStoryStore.isLoading" class="text-gray-800 dark:text-gray-200 text-center">
            <p> {{ t('loadingPosts') }}</p>
          </div>

          <!-- Error State -->
          <div v-if="postStoryStore.error" class="text-center text-red-500">
            <p>{{ postStoryStore.error }}</p>
          </div>

          <!-- Stories for mobile -->
          <div class="lg:hidden mb-6 w-[94vw]">
            <div
              class="z-50 p-2 w-[94vw] flex items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-700">
              <!-- Logo Button -->
              <button @click="refreshFeed" class="flex-shrink-0 max-w-10" style="scroll-snap-align: start;">
                <img src="@/assets/logo.png" alt="Logo" class="w-full object-contain rounded-lg" />
              </button>


              <!-- Notification Icon Button -->
              <div class="relative">
                <button @click="toggleMobileNotifications"
                  class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                  aria-label="Notifications">
                  <i class="ri-notification-line text-gray-800 dark:text-gray-200 text-2xl"></i>

                  <!-- Notification Badge -->
                  <span v-if="unreadNotifications?.length > 0"
                    class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">

                    {{ unreadNotifications?.length }}
                  </span>
                </button>
              </div>
              <!-- Mobile Notification Modal -->
              <Teleport to="body">
                <Transition name="modal">
                  <div v-if="showMobileNotification"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div class="w-full max-w-md transform transition-all">
                      <NotificationCard :showCloseButton="true" @close="closeMobileNotifications" />
                    </div>
                  </div>
                </Transition>
              </Teleport>
            </div>
            <div class="flex space-x-4 mt-6 overflow-x-auto pb-4 hide-scrollbar" style="scroll-snap-type: x mandatory;">
              <StoryCard v-for="story in postStoryStore.stories" :key="story._id" :story="story"
                class="flex-shrink-0 w-[25%] max-w-[100px] sm:max-w-[120px]" style="scroll-snap-align: start;" />
            </div>
          </div>

          <!-- Feed-->
          <div class="hidden lg:block w-80 order-1 lg:order-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {{ t('feed') }}
              </h2>
            </div>

            <div class="space-y-6 w-full sm:w-80 md:w-[28rem] lg:w-[36rem] xl:w-[42rem] mx-auto">
              <PostCard v-for="post in postStoryStore.posts" :key="post.id" :post="post" class="w-full h-auto" />
            </div>
          </div>

          <!-- Feed for mobile -->
          <div class="lg:hidden mb-6">
            <div class="space-y-6 w-full sm:w-80 md:w-[28rem] lg:w-[36rem] xl:w-[42rem] mx-auto">
              <PostCard v-for="post in postStoryStore.posts" :key="post.id" :post="post" class="w-full h-auto" />
            </div>
          </div>

        </div>

        <!-- Stories for desktop -->

        <div class="hidden lg:block w-80 order-1 lg:order-2 ">
          <div class="sticky top-4">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{{ t('stories') }}</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div v-if="postStoryStore.stories.length > 0" class="grid grid-cols-3 gap-4">
                <StoryCard v-for="story in postStoryStore.stories" :key="story._id" :story="story" />
              </div>
            </div>
            <div class="mt-6">
              <NotificationCard :showCloseButton="false" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import PostCard from '@/components/PostCard.vue';
import StoryCard from '@/components/StoryCard.vue';
import { onMounted } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';
import { usePostStoryStore } from '@/stores/homePageStore'; // Import the store
import NotificationCard from '@/components/NotificationCard.vue';

const showMobileNotification = ref(false);
const unreadNotifications = ref([]); // Replace with actual unread count from your store



const { t } = useLanguageStore();
const postStoryStore = usePostStoryStore();

const toggleMobileNotifications = () => {
  showMobileNotification.value = !showMobileNotification.value;
};

const closeMobileNotifications = () => {
  showMobileNotification.value = false;
};

onMounted(async () => {
  postStoryStore.fetchPosts();
  postStoryStore.fetchStories();
  const result = await postStoryStore.fetchUserProfile()
  unreadNotifications.value = postStoryStore.myProfile.notifications.filter(notification => notification.seen === false).reverse();
});
</script>
