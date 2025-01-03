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
          <v-icon name="ri-search-line"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl" />
          <input v-model="searchQuery" type="text" placeholder="Search posts..."
            class="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-200 w-full" />
        </div>
      </div>
      <!-- Masonry Layout Container for Explore Post Cards -->
      <div v-if="filteredPosts.length > 0" class="explore-grid">
        <ExplorePostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
      <div v-else class="text-center text-gray-600 dark:text-gray-400 mt-8">
        No posts to explore at the moment.
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import ExplorePostCard from '@/components/ExplorePostCard.vue';
import { useLanguageStore } from '@/stores/languageStore';
const { t } = useLanguageStore(); // Translation function
// Sample data for explore posts
const explorePosts = ref(Array(20).fill(null).map((_, index) => ({
  id: index,
  mediaUrl: `https://via.assets.so/game.png?id=${index + 1}&q=95&w=360&h=${360 + (index % 5) * 20}&fit=fill`,
  description: `Explore post ${index + 1}`,
  hashtags: ['photography', 'nature', 'travel', 'art', 'food', 'fashion', 'technology']
    .sort(() => 0.5 - Math.random())
    .slice(0, 3 + Math.floor(Math.random() * 3)),
})));

// Search query
const searchQuery = ref('');

// Filtered posts based on search query
const filteredPosts = computed(() => {
  return explorePosts.value.filter(post =>
    post.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});
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
