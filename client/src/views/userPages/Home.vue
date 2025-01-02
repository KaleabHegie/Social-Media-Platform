<template>
  <main class="min-h-screen pt-4 pb-20 px-4 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:space-x-8">
        <!-- Main content area -->
        <div class="flex-grow order-2 lg:order-1">

          <!-- Stories for mobile -->
          <div class="lg:hidden mb-6">
            <div class="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar" style="scroll-snap-type: x mandatory;">
              <StoryCard v-for="story in stories" :key="story.id" :story="story"
                class="flex-shrink-0 w-[25%] max-w-[100px] sm:max-w-[120px]" style="scroll-snap-align: start;" />
            </div>
          </div>


          <!-- Feed-->
          <div class="hidden lg:block w-80 order-1 lg:order-2" >
            <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">    {{ t('feed') }}</h2>
            <div class="space-y-6 w-full sm:w-80 md:w-[28rem] lg:w-[36rem] xl:w-[42rem] mx-auto">
              <PostCard v-for="post in posts" :key="post.id" :post="post" class="w-full h-auto" />
            </div>
          </div>
             <!-- Feed for mobile -->
          <div class="lg:hidden mb-6" >
            <div class="space-y-6 w-full sm:w-80 md:w-[28rem] lg:w-[36rem] xl:w-[42rem] mx-auto">
              <PostCard v-for="post in posts" :key="post.id" :post="post" class="w-full h-auto" />
            </div>
          </div>

        </div>

        <!-- Stories for desktop -->
        <div class="hidden lg:block w-80 order-1 lg:order-2">
          <div class="sticky top-4">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{{ t('stories') }}</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div class="grid grid-cols-3 gap-4">
                <StoryCard v-for="story in stories" :key="story.id" :story="story" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import PostCard from '@/components/PostCard.vue';
import StoryCard from '@/components/StoryCard.vue';
import { ref } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';
const { t } = useLanguageStore(); // Translation function
// Sample data - in real app this would come from an API
const posts = ref(Array(20).fill(null).map((_, index) => ({
  id: index,
  username: 'user' + (index + 1),
  userAvatar: `https://via.assets.so/movie.png?id=${index + 1}&q=95&w=360&h=360&fit=fill`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  media: [
    {
      type: 'image',
      url: `https://via.assets.so/game.png?id=${index + 1}&q=95&w=360&h=360&fit=fill`,
      description: 'Sample post image'
    },
    {
      type: 'image',
      url: `https://via.assets.so/watch.png?id=${index + 1}&q=95&w=360&h=360&fit=fill`,
      description: 'Sample post image 2'
    }
  ],
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  hashtags: ['photography', 'nature', 'travel'].map(tag => tag + index),
  caption: `This is a sample caption for post number ${index + 1}. It can be long or short depending on the content. his is a sample caption for post number ${index + 1}. It can be long or short depending on the content his is a sample caption for post number ${index + 1}. It can be long or short depending on the content`
})));


// Sample data for stories
const stories = ref(Array(9).fill(null).map((_, index) => ({
  id: index,
  username: 'story_user' + (index + 1),
  userAvatar: `https://via.assets.so/game.png?id=${index + 1}&q=95&w=360&h=360&fit=fill`,
  mediaUrl: `https://via.assets.so/game.png?id=${index + 1}&q=95&w=360&h=360&fit=fill`
})));
</script>