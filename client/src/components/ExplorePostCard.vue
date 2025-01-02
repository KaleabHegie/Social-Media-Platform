<template>
  <div
    class="relative overflow-hidden rounded-lg shadow-lg mb-3 break-inside-avoid transform transition-transform duration-300 hover:scale-105">
    <img :src="post.mediaUrl" :alt="post.description" class="w-full h-auto object-cover" />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-4">
      <!-- Conditional rendering for hashtags -->
      <div v-if="showHashtags" class="flex flex-wrap gap-2">
        <span v-for="tag in post.hashtags" :key="tag"
          class="text-xs font-medium text-white bg-black/30 px-2 py-1 rounded-full">
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  },
  showHashtags: {
    type: Boolean,
    default: true // Default to true, showing hashtags
  }
});
</script>
