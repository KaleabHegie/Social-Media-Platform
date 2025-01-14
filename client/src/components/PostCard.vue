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
        <div>
          <ul v-if="post.medias && post.medias.length">
            <li v-for="(media, index) in post.medias" :key="index">
              {{ media }}
            </li>
          </ul>
          <p v-else>No media available.</p>
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
          <button @click="toggleCaption" class="text-sky-500 dark:text-sky-400 text-sm mt-2" @click.stop>
            {{ showFullCaption ? t('readLess') : t('readMore') }}
          </button>
        </div>

        
  </router-link>

        <!-- Interaction Buttons -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <button @click="toggleLike" class="flex items-center space-x-2 group"
              :aria-label="isLiked ? 'Unlike post' : 'Like post'" @click.stop>
              <i :class="[
                'ri-thumb-up-line',
                isLiked ? 'text-sky-500' : 'text-gray-600 dark:text-gray-400',
              ]" class="text-xl group-hover:scale-110 transition-transform"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ props.post.likes_count || 0 }}
              </span>
            </button>

            <router-link :to="`/viewpost/${post._id}`" class="flex items-center space-x-2 group"
              aria-label="View comments" @click.stop>
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
          <router-link v-for="tag in props.post.hashtags || []" :key="tag" :to="`/home`"
            class="text-sky-500 dark:text-sky-400 text-sm hover:underline" @click.stop>
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




const isLiked = ref(false);
const showFullCaption = ref(false);

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

const toggleCaption = () => {
  showFullCaption.value = !showFullCaption.value;
};

const truncatedCaption = computed(() => {
  return props.post.caption && props.post.caption.length > 100
    ? props.post.caption.slice(0, 100) + '...'
    : props.post.caption || '';
});

const handleAvatarError = (e) => {
  e.target.src = '/default-avatar.png';
};
</script>
