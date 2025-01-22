<template>
  <main class="min-h-screen pt-4 pb-20 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Explore Tabs -->
      <div class="flex sm:flex-row flex-wrap justify-between items-center">
        <!-- the buttons on larger screens -->
        <div class="hidden space-x-2 sm:flex -mt-6">
          <button
            :class="{ 'bg-sky-500 text-white': activeTab === 'posts', 'text-gray-800 dark:text-gray-200': activeTab !== 'posts' }"
            @click="setActiveTab('posts')" class="px-4 py-2 mr-1 rounded-lg focus:outline-none">
            {{ t('tabsposts') }}
          </button>
          <button
            :class="{ 'bg-sky-500 text-white': activeTab === 'users', 'text-gray-800 dark:text-gray-200': activeTab !== 'users' }"
            @click="setActiveTab('users')" class="px-4 py-2 rounded-lg focus:outline-none">
            {{ t('users') }}
          </button>
        </div>

        <!-- icons on mobile -->
        <div class="flex space-x-6 -mt-8 sm:hidden">
          <i :class="{ 'text-sky-500': activeTab === 'posts', 'text-gray-800 dark:text-gray-200': activeTab !== 'posts' }"
            @click="setActiveTab('posts')" class="ri-file-list-3-line text-2xl cursor-pointer"></i>
          <i :class="{ 'text-sky-500': activeTab === 'users', 'text-gray-800 dark:text-gray-200': activeTab !== 'users' }"
            @click="setActiveTab('users')" class="ri-user-3-line text-2xl cursor-pointer"></i>

        </div>

        <!-- Search Bar (Same for both Posts and Users) -->
        <div class="relative w-30 sm:w-64 md:w-96 mb-6 mt-3 sm:mt-0">
          <i
            class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 -mt-0.5 text-xl"></i>
          <input v-model="searchQuery" type="text" :placeholder="t('searchPosts')"
            class="pl-10 pr-4 py-2 -mt-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-200 w-full"
            @input="onSearch" />
        </div>
      </div>

      <div class="overflow-y-auto h-80vh">

        <!-- Explore Content -->
        <div v-if="activeTab === 'posts'">
          <!-- Posts Grid -->
          <div v-if="!postStoryStore.isLoading && postStoryStore.explore.length > 0" class="explore-grid">
            <ExplorePostCard v-for="post in postStoryStore.explore" :key="post.id" :post="post" />
          </div>

          <!-- No Posts Message -->
          <div v-else-if="!postStoryStore.isLoading && !postStoryStore.error"
            class="text-center text-gray-600 dark:text-gray-400 mt-8">
            {{ t('noPosts') }}
          </div>

          <!-- Loading Indicator -->
          <div v-if="postStoryStore.isLoading" class="text-center text-gray-600 dark:text-gray-400 mt-8">
            {{ t('loadingPosts') }}
          </div>

          <!-- Error Message -->
          <div v-if="postStoryStore.error" class="text-center text-red-500 dark:text-red-400 mt-8">
            {{ postStoryStore.error }}
          </div>
        </div>

        <!-- Users Grid (Temp placeholder) -->
        <div v-if="activeTab === 'users'" class="mt-3">
          <div v-if="!postStoryStore.isLoading && postStoryStore.searchedUsers.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!-- Loop through the users -->
            <ExploreUserProfileCard v-for="user in postStoryStore.searchedUsers" :key="user.id" :user="user" />
          </div>

          <!-- No Users Message -->
          <div v-else class="text-center text-gray-600 dark:text-gray-400 mt-8">
            {{ t('noUsersFound') }}
          </div>
        </div>
      </div>

    </div>
  </main>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostStoryStore } from '@/stores/homePageStore'; // Pinia store
import { useLanguageStore } from '@/stores/languageStore'; // Translation store
import ExplorePostCard from '@/components/ExplorePostCard.vue';
import ExploreUserProfileCard from '@/components/ExploreUserProfileCard.vue';

// Placeholder users data (to be replaced later with real data)
const users = [
  { id: 1, name: 'John Doe', username: '@johndoe' },
  { id: 2, name: 'Jane Smith', username: '@janesmith' },
  { id: 3, name: 'Alex Johnson', username: '@alexjohnson' },
];

const { t } = useLanguageStore();
const searchQuery = ref('');
const activeTab = ref('posts'); // Active tab (posts or users)
const router = useRouter();
const route = useRoute();

// Pinia store for posts
const postStoryStore = usePostStoryStore();

onMounted(async () => {
  searchQuery.value = route.query.hashtag;
});
// Fetch posts whenever the hashtag in the query changes
watch(
  () => route.query.hashtag,
  async (newHashtag) => {
    try {
      searchQuery.value = newHashtag;
      await postStoryStore.fetchExplore(newHashtag || '');
      await postStoryStore.searchUsers(newHashtag || '');
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  },
  { immediate: true }
);

// Update the route when search input changes
const onSearch = () => {
  router.push({ path: '/explore', query: { hashtag: searchQuery.value || '' } });
};

// Change active tab
const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>

<style scoped>
.explore-grid {
  column-gap: 1rem;
  column-count: 3;
}

@media (max-width: 768px) {
  .explore-grid {
    column-count: 2;
  }
}

@media (max-width: 480px) {
  .explore-grid {
    column-count: 1;
  }
}

button {
  transition: background-color 0.3s, color 0.3s;
}

@media (max-width: 768px) {
  .flex {
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .flex-wrap {
    flex-wrap: nowrap;
  }

  .relative {
    width: auto;
    margin-top: 0;
  }
}
</style>
