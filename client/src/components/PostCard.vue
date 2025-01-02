<template>
  <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden">
    <!-- Carousel Section -->
    <div class="relative fade-mask">
      <!-- User Info Overlay -->
      <div class="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div class="flex items-center">
          <router-link :to="`/user/${props.post.username}`" class="flex items-center group">
            <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img 
                :src="props.post.userAvatar || '/default-avatar.png'" 
                :alt="props.post.username"
                class="w-full h-full object-cover"
                @error="handleAvatarError"
              />
            </div>
            <div class="ml-3">
              <h2 class="text-white font-semibold group-hover:underline">{{ props.post.username }}</h2>
              <time :datetime="props.post.createdAt" class="text-sm text-gray-200">
                {{ formatDate(props.post.createdAt) }}
              </time>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Carousel -->
      <div class="relative">
        <div class="flex transition-transform duration-300 ease-in-out" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
          <div v-for="(media, index) in props.post.media" :key="index" class="w-full flex-shrink-0">
            <img 
              v-if="media.type === 'image'"
              :src="media.url" 
              :alt="media.description"
              class="w-full h-auto object-contain"
            />
            <video 
              v-else 
              :src="media.url"
              controls
              class="w-full h-auto object-contain"
            ></video>
          </div>
        </div>


        <!-- Carousel Navigation -->
        <div v-if="props.post.media.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          <button 
            v-for="(_, index) in props.post.media" 
            :key="index"
            @click="activeSlide = index"
            class="w-2 h-2 rounded-full transition-colors duration-200"
            :class="index === activeSlide ? 'bg-white' : 'bg-white/50'"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-4">
      <!-- Caption -->
      <div class="mb-4">
        <p v-if="showFullCaption" class="text-gray-800 dark:text-white">{{ props.post.caption }}</p>
        <p v-else class="text-gray-800 dark:text-white">{{ truncatedCaption }}</p>
        <button 
          @click="toggleCaption" 
          class="text-sky-500 dark:text-sky-400 text-sm mt-2"
        >
          {{ showFullCaption ? 'Read Less' : 'Read More' }}
        </button>
      </div>

      <!-- Interaction Buttons -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <button 
            @click="toggleLike" 
            class="flex items-center space-x-2 group"
            :aria-label="isLiked ? 'Unlike post' : 'Like post'"
          >
            <v-icon 
              name="ri-thumb-up-line"
              :class="isLiked ? 'text-sky-500' : 'text-gray-600 dark:text-gray-400'"
              class="text-xl group-hover:scale-110 transition-transform"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ props.post.likes }}</span>
          </button>

          <button class="flex items-center space-x-2 group" aria-label="View comments">
            <v-icon 
              name="ri-chat-1-line"
              class="text-xl text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ props.post.comments }}</span>
          </button>
        </div>
      </div>

      <!-- Hashtags -->
      <div class="flex flex-wrap gap-2">
        <router-link
          v-for="tag in props.post.hashtags"
          :key="tag"
          :to="`/tag/${tag}`"
          class="text-sky-500 dark:text-sky-400 text-sm hover:underline"
        >
          #{{ tag }}
        </router-link>
      </div>
    </div>

  </article>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { format } from 'date-fns';

  const props = defineProps({
    post: {
      type: Object,
      required: true
    }
  });

  const activeSlide = ref(0);
  const isLiked = ref(false);
  const showFullCaption = ref(false);

  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy • HH:mm');
  };

  const toggleLike = () => {
    isLiked.value = !isLiked.value;
    // Here you would typically make an API call to update the like status
  };

  const toggleCaption = () => {
    showFullCaption.value = !showFullCaption.value;
  };

  const truncatedCaption = computed(() => {
    return props.post.caption.length > 100 ? props.post.caption.slice(0, 100) + '...' : props.post.caption;
  });

  const handleAvatarError = (e) => {
    e.target.src = '/default-avatar.png';
  };
</script>

<style scoped>
  .fade-mask {
    -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
    mask-image: linear-gradient(to bottom, rgb(0, 0, 0) 97%, transparent 100%);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }
</style>
