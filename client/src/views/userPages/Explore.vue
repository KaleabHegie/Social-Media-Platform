<template>
  <main class="min-h-screen pt-4 pb-20 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Explore and Search bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <!-- Explore heading -->
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">
          {{ t('explore') }}
        </h2>
        <!-- Search Input -->
        <div class="relative w-full sm:w-64 md:w-96">
          <i
            class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl"></i>
          <input v-model="searchQuery" type="text" placeholder="Search posts..."
            class="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-200 w-full"
            @input="onSearch" />
        </div>
      </div>

      <!-- Posts Grid -->
      <div v-if="!postStoryStore.isLoading && postStoryStore.explore.length > 0" class="explore-grid">
        <ExplorePostCard v-for="post in postStoryStore.explore" :key="post.id" :post="post" />
      </div>

      <!-- No Posts Message -->
      <div v-else-if="!postStoryStore.isLoading && !postStoryStore.error"
        class="text-center text-gray-600 dark:text-gray-400 mt-8">
        No posts to explore at the moment.
      </div>

      <!-- Loading Indicator -->
      <div v-if="postStoryStore.isLoading" class="text-center text-gray-600 dark:text-gray-400 mt-8">
        Loading posts...
      </div>

      <!-- Error Message -->
      <div v-if="postStoryStore.error" class="text-center text-red-500 dark:text-red-400 mt-8">
        {{ postStoryStore.error }}
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

const { t } = useLanguageStore();
const searchQuery = ref('');
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
