<template>
  <main class="min-h-screen pt-4 pb-20 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Explore and Search bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <!-- Explore text with icon before it -->
        <div class="flex items-center space-x-2 mb-4 sm:mb-0 sm:shrink-0">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">
            {{ t('explore') }}
          </h2>
        </div>
        <!-- Search Input Field with Icon -->
        <div class="relative w-full sm:w-64 md:w-96">
          <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl"></i>
          <input v-model="searchQuery" type="text" placeholder="Search posts..."
            class="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-200 w-full" />
        </div>
      </div>
      <!-- Masonry Layout Container for Explore Post Cards -->
      <div v-if="!postStoryStore.isLoading && filteredPosts.length > 0" class="explore-grid">
        <ExplorePostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
      <div v-else-if="!postStoryStore.isLoading && !postStoryStore.error" class="text-center text-gray-600 dark:text-gray-400 mt-8">
        No posts to explore at the moment.
      </div>
      <div v-if="postStoryStore.isLoading" class="text-center text-gray-600 dark:text-gray-400 mt-8">
        Loading posts...
      </div>
      <div v-if="error" class="text-center text-red-500 dark:text-red-400 mt-8">
        {{ error }}
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePostStoryStore } from '@/stores/homePageStore'; // Import Pinia store
import { useLanguageStore } from '@/stores/languageStore';
import ExplorePostCard from '@/components/ExplorePostCard.vue';

const { t } = useLanguageStore(); // Translation function

// Access the Pinia store
const postStoryStore = usePostStoryStore();



// Local state for search
const searchQuery = ref('');

// Reactive store properties
const { isLoading, error, posts } = postStoryStore;



// Filtered posts based on search query
const filteredPosts = computed(() => {
  return postStoryStore.posts.filter(
    (post) =>
      post.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

// Fetch posts on component mount
onMounted(() => {
  postStoryStore.fetchExplore(); // Fetch explore feed
});

console.log(postStoryStore);
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
</style>
