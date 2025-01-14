<template>
  <!-- Wrap the entire card with a router-link -->

  <article
    class="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <!-- Carousel Section -->

    <div class="relative fade-mask">
      <!-- User Info Overlay -->
      <div class="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div class="flex items-center">
          <router-link :to="`/user/${props.post.user.user_name}`" class="flex items-center group" @click.stop>
            <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img :src="props.post.user.profile_photo_url || '/default-avatar.png'" :alt="props.post.user.user_name"
                class="w-full h-full object-cover" @error="handleAvatarError" />
            </div>
            <div class="ml-3">
              <h2 class="text-white text-lg font-semibold group-hover:underline">
                {{ props.post.user.user_name }}
              </h2>
              <time :datetime="props.post.createdAt" class="text-md text-gray-200">
                {{ formatDate(props.post.createdAt) }}
              </time>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Carousel -->
      <div class="relative" v-touch:swipe.left="onSwipeLeft" v-touch:swipe.right="onSwipeRight">
        <!-- Media Slider -->
        <div v-if="post.medias && post.medias.length" class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
          <div v-for="(media, index) in post.medias" :key="index" class="w-full flex-shrink-0">
            <template v-if="media.endsWith('.mp4') || media.endsWith('.webm')">
              <video :src="media" autoplay controls loop class="w-full h-auto object-contain"></video>
            </template>
            <template v-else>
              <img :src="media" alt="Media" class="w-full h-auto object-contain" />
            </template>
          </div>
        </div>
        <div v-else class="pt-20">

        </div>
        <!-- Carousel Navigation -->
        <div v-if="post.medias && post.medias.length > 1"
          class="absolute bottom-9 left-[45%] mx-auto flex justify-center gap-2 p-2 rounded-md bg-[#0000006e]">
          <button v-for="(_, index) in post.medias" :key="index" @click.stop.prevent="goToSlide(index)"
            class="w-3 h-3 rounded-full transition-colors duration-200"
            :class="index === activeSlide ? 'bg-white' : 'bg-white/50'"
            :aria-label="`Go to slide ${index + 1}`"></button>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-4">
      <router-link :to="`/viewpost/${props.post._id}`" class="block">
        <!-- Caption -->
        <div class="mb-4">
          <p v-if="showFullCaption" class="text-gray-800 dark:text-white">
            {{ props.post.caption || '' }}
          </p>
          <p v-else class="text-gray-800 dark:text-white">
            {{ truncatedCaption }}
          </p>
          <!-- Show Read More only if caption is longer than 100 characters -->
          <button v-if="props.post.caption && props.post.caption.length > 100" @click.stop.prevent="toggleCaption"
            class="text-sky-500 dark:text-sky-400 text-sm mt-2">
            {{ showFullCaption ? t('readLess') : t('readMore') }}
          </button>
        </div>
      </router-link>

      <!-- Interaction Buttons -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <button @click.stop.prevent="toggleLike" class="flex items-center space-x-2 group"
            :aria-label="isLiked ? 'Unlike post' : 'Like post'">
            <i :class="[
              'ri-thumb-up-line',
              isLiked ? 'text-sky-500' : 'text-gray-600 dark:text-gray-400',
            ]" class="text-xl group-hover:scale-110 transition-transform"></i>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ props.post.likes_count || 0 }}
            </span>
          </button>

          <router-link :to="`/viewpost/${post._id}`" class="flex items-center space-x-2 group"
            aria-label="View comments" @click.stop.prevent>
            <i
              class="ri-chat-1-line text-xl text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform"></i>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ props.post.comments_count || 0 }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- Hashtags -->
      <div class="flex flex-wrap gap-2">
        <router-link v-for="tag in props.post.hashtags || []" :key="tag"
          :to="{ path: '/explore', query: { hashtag: tag } }"
          class="text-sky-500 dark:text-sky-400 text-sm hover:underline" @click.stop.prevent>
          #{{ tag }}
        </router-link>
      </div>

    </div>
  </article>
</template>


<script setup>
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { useLanguageStore } from '@/stores/languageStore';

const { t } = useLanguageStore(); // Translation function
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const activeSlide = ref(0);

const goToSlide = (index) => {
  activeSlide.value = index
}

const onSwipeLeft = () => {
  console.log("Swipeeeeee")
  if (activeSlide.value < props.post.medias.length - 1) {
    activeSlide.value++
  }
}

const onSwipeRight = () => {
  if (activeSlide.value > 0) {
    activeSlide.value--
  }
}


const isLiked = ref(false);

const formatDate = (date) => {
  const formattedDate = new Date(date);
  if (isNaN(formattedDate)) {
    return ''; // Return empty string if the date is invalid
  }
  return format(formattedDate, 'MMM d, yyyy • HH:mm');
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const showFullCaption = ref(false);


const truncatedCaption = computed(() => {
  return props.post.caption && props.post.caption.length > 100
    ? props.post.caption.slice(0, 100) + '...'
    : props.post.caption || '';
});

const toggleCaption = () => {
  showFullCaption.value = !showFullCaption.value;
};
const handleAvatarError = (e) => {
  e.target.src = '/default-avatar.png';
};
</script>
