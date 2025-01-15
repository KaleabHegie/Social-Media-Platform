<template>
  <div>
    <div @click="openModal" class="relative w-20 h-20 cursor-pointer group">
      <div class="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-100 rounded-lg p-0.5">
        <div class="w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <div v-if="story.medias && story.medias.length" class="flex transition-transform duration-300 ease-in-out"
            :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
            <div v-for="(media, index) in story.medias" :key="index" class="w-full h-full flex-shrink-0">
              <template v-if="media.endsWith('.mp4') || media.endsWith('.webm')">
                <video :src="media" autoplay muted loop class="w-full h-full object-cover" />
              </template>
              <template v-else>
                <img :src="media" alt="Media" class="w-full h-full object-cover" />
              </template>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-2 border-sky-100 dark:border-gray-900 overflow-hidden">
        <img :src="story.user.profile_photo_url || '/default-avatar.png'" :alt="story.user.user_name"
          class="w-full h-full object-cover" />
      </div>
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span class="text-xs text-white font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
          {{ story.user.user_name }}
        </span>
      </div>
    </div>


    <StoryViewCard :story="story" :isOpen="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StoryViewCard from './StoryViewCard.vue'

const props = defineProps({
  story: {
    type: Object,
    required: true
  }
})

const activeSlide = ref(0)
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>
