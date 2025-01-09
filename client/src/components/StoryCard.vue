<template>
    <div class="relative w-20 h-20 cursor-pointer group">
      <div class="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-100 rounded-lg p-0.5">
        <div class="w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <img 
            :src="story.medias[0]" 
            :alt="`${story.username}'s story`"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <div class="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-2 border-sky-100 dark:border-gray-900 overflow-hidden">
        <img 
          :src="story.userAvatar" 
          :alt="story.username"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span class="text-xs text-white font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
          {{ story.username }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    story: {
      type: Object,
      required: true
    }
  });
  </script>