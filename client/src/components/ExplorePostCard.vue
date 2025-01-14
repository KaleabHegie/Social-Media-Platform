<template>
  <router-link :to="`/viewpost/${post._id}`"
    class="relative block overflow-hidden rounded-lg shadow-lg mb-3 break-inside-avoid transform transition-transform duration-500 hover:scale-[102%] min-h-0">
    <!-- Conditional rendering for media -->
    <template v-if="post.medias && post.medias.length > 0">
      <template v-if="isVideo(post.medias[0])">
        <video :src="post.medias[0]" autoplay muted loop class="w-full h-auto object-cover"></video>
      </template>
      <template v-else>
        <img :src="post.medias[0]" :alt="post.description" class="w-full h-auto object-cover" />
      </template>
    </template>
    <!-- Hashtags -->
    <div v-if="showHashtags" class="absolute bottom-0 left-0 right-0 p-4">
      <div class="flex flex-wrap gap-2">
        <router-link v-for="tag in post.hashtags" :key="tag" :to="{ path: '/explore', query: { hashtag: tag } }"
          class="text-xs font-medium text-white bg-black/30 px-2 py-1 rounded-full transition-colors duration-200 hover:bg-black/50">
          #{{ tag }}
        </router-link>
      </div>
    </div>

  </router-link>
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

// Helper function to check if media is a video
const isVideo = (media) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg'];
  return videoExtensions.some((ext) => media.endsWith(ext));
};
</script>
