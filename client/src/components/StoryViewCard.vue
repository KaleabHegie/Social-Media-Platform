<template>
  <Teleport to="body">
    <div v-if="isOpen" @click="closeModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div @click.stop class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-auto overflow-hidden">
        <div class="relative">
          <!-- Story content -->
          <div class="aspect-w-9 aspect-h-16">
            <div v-if="story.medias && story.medias.length" class="flex transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${activeSlide * 100}%)` }" v-touch:swipe.left="nextSlide"
              v-touch:swipe.right="prevSlide">
              <div v-for="(media, index) in story.medias" :key="index" class="w-full flex-shrink-0">
                <template v-if="media.endsWith('.mp4') || media.endsWith('.webm')">
                  <video :src="media" autoplay controls loop class="w-full h-full object-cover"></video>
                </template>
                <template v-else>
                  <img :src="media" alt="Media" class="w-full h-full object-cover" />
                </template>
              </div>
            </div>
          </div>

          <!-- Navigation dots -->
          <div v-if="story.medias && story.medias.length > 1"
            class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <button v-for="(_, index) in story.medias" :key="index" @click.stop="goToSlide(index)"
              class="w-2 h-2 rounded-full transition-colors duration-200"
              :class="index === activeSlide ? 'bg-white' : 'bg-white/50'" :aria-label="`Go to slide ${index + 1}`">
            </button>
          </div>

          <!-- User info -->
          <div class="absolute top-4 left-4 flex items-center space-x-2">
            <img :src="story.user.profile_photo_url || '/default-avatar.png'" :alt="story.user.user_name"
              class="w-8 h-8 rounded-full object-cover" />
            <span class="text-white font-medium text-sm">{{ story.user.user_name }}</span>
          </div>

          <!-- Close button -->
          <button @click="closeModal" class="absolute top-4 right-4 text-white hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  story: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const activeSlide = ref(0)

const closeModal = () => {
  emit('close')
}

const goToSlide = (index) => {
  activeSlide.value = index
}

const nextSlide = () => {
  if (activeSlide.value < props.story.medias.length - 1) {
    activeSlide.value++
  }
}

const prevSlide = () => {
  if (activeSlide.value > 0) {
    activeSlide.value--
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    activeSlide.value = 0
  }
})
</script>
