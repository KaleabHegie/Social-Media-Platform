<template>
  <main class="min-h-screen pt-4 pb-20 px-4 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:space-x-8">
        <!-- Main content area -->
        <div class="flex-grow order-2 lg:order-1">

          <!-- Loading State for Stories -->
          <div v-if="postStoryStore.isLoading" class="text-center">
            <p>Loading stories and posts...</p>
          </div>

          <!-- Error State -->
          <div v-if="postStoryStore.error" class="text-center text-red-500">
            <p>{{ postStoryStore.error }}</p>
          </div>


          <!-- maybe the issue -->
          <!-- Stories for mobile -->
          <div v-if="postStoryStore.stories.length > 0" class="lg:hidden mb-6 w-[90vw]">
            <div class="fixed top-2 z-50 h-16 bg-red-400 w-full flex items-center justify-start mb-4">
              <div class="flex-shrink-0 max-w-16" style="scroll-snap-align: start;">
                <img src="@/assets/logo.png" alt="Logo" class="w-full object-contain rounded-lg" />
              </div>
              <button @click="refreshFeed"
                class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                <i class="ri-refresh-line text-gray-800 dark:text-gray-200 text-xl"></i>
              </button>

              <button @click="showNotification = true" class="bg-blue-500 text-white px-4 py-2 rounded">
                Show Nofiications Icon here
              </button>

              <!-- Modal Component -->
              <Modal v-if="showNotification" @close="showNotification = false">
                <NotificationCard :showCloseButton="true" />
              </Modal>
            </div>
            <div class="flex space-x-4 mt-16 overflow-x-auto pb-4 hide-scrollbar"
              style="scroll-snap-type: x mandatory;">
              <StoryCard v-for="story in postStoryStore.stories" :key="story.id" :story="story"
                class="flex-shrink-0 w-[25%] max-w-[100px] sm:max-w-[120px]" style="scroll-snap-align: start;" />
            </div>
          </div>

          <!-- Feed-->
          <div class="hidden lg:block w-80 order-1 lg:order-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {{ t('feed') }}
              </h2>
              <button @click="refreshFeed"
                class=" w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                <i class="ri-refresh-line text-gray-800 dark:text-gray-200 text-xl"></i>
              </button>
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

        <div v-if="postStoryStore.stories.length > 0" class="hidden lg:block w-80 order-1 lg:order-2 ">
          <div class="sticky top-4">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{{ t('stories') }}</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div class="grid grid-cols-3 gap-4">
                <StoryCard v-for="story in postStoryStore.stories" :key="story.id" :story="story" />
              </div>
            </div>
            <div>
              <NotificationCard :showCloseButton="true" />
            </div>
          </div>

        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import PostCard from '@/components/PostCard.vue';
import StoryCard from '@/components/StoryCard.vue';
import { onMounted } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';
import { usePostStoryStore } from '@/stores/homePageStore'; // Import the store
import NotificationCard from '../../components/NotificationCard.vue';
import Modal from 'vue3-modal';
const showNotification = ref(false);



const { t } = useLanguageStore();

const postStoryStore = usePostStoryStore();


onMounted(() => {
  postStoryStore.fetchPosts();
  postStoryStore.fetchStories();
});
</script>
