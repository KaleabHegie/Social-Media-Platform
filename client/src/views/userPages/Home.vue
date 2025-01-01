<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 pt-4 pb-20 px-4 lg:ml-64">
    <div class="max-w-xl mx-auto">
      <!-- Feed -->
      <div class="space-y-6">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import PostCard from '@/components/PostCard.vue';
import { ref } from 'vue';

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
  hashtags: ['photography', 'nature', 'travel'].map(tag => tag + index)
})));
</script>