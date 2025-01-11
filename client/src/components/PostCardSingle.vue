<template>
  <!-- Ensure post is resolved before rendering -->
  <div v-if="post">
    <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <!-- Render the content once post is resolved -->
    
      <div class="relative fade-mask">
        <!-- User Info Overlay -->
        <div class="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div class="flex items-center">
            <router-link
              :to="`/user/${post.username}`"
              class="flex items-center group"
              @click.stop
            >
              <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                <img
                  :src="post.userAvatar || '/default-avatar.png'"
                  :alt="post.username"
                  class="w-full h-full object-cover"
                  @error="handleAvatarError"
                />
              </div>
              <div class="ml-3">
                <h2 class="text-white font-semibold group-hover:underline">
                  {{ post.username }}
                </h2>
                <time :datetime="post.createdAt" class="text-sm text-gray-200">
                  {{ formatDate(post.createdAt) }}
                </time>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Carousel Section -->
        <div class="relative">
          <div v-if="post.medias && post.medias.length" class="flex transition-transform duration-300 ease-in-out" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
            <div v-for="(media, index) in post.medias" :key="index" class="w-full flex-shrink-0">
              <img :src="media" :alt="media.description" class="w-full h-auto object-contain" />
            </div>
          </div>
          <div v-else>
            <p class="text-center text-gray-500 dark:text-gray-400">No media available.</p>
          </div>

          <!-- Carousel Navigation -->
          <div v-if="post.media && post.media.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <button
              v-for="(_, index) in post.media"
              :key="index"
              @click="activeSlide = index"
              class="w-2 h-2 rounded-full transition-colors duration-200"
              :class="index === activeSlide ? 'bg-white' : 'bg-white/50'"
              :aria-label="`Go to slide ${index + 1}`"
              @click.stop
            ></button>
          </div>
        </div>
      </div>

      <!-- Post Content -->
      <div class="p-4">
        <!-- Caption -->
        <div class="mb-4">
          <p v-if="showFullCaption" class="text-gray-800 dark:text-white">
            {{ post.caption || '' }}
          </p>
          <p v-else class="text-gray-800 dark:text-white">
            {{ truncatedCaption }}
          </p>
          <button @click="toggleCaption" class="text-sky-500 dark:text-sky-400 text-sm mt-2" @click.stop>
            {{ showFullCaption ? t('readLess') : t('readMore') }}
          </button>
        </div>

        <!-- Interaction Buttons -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <button @click="toggleLike" class="flex items-center space-x-2 group" :aria-label="isLiked ? 'Unlike post' : 'Like post'" @click.stop>
              <i :class="['ri-thumb-up-line', isLiked ? 'text-sky-500' : 'text-gray-600 dark:text-gray-400']" class="text-xl group-hover:scale-110 transition-transform"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ post.likes_count || 0 }}
              </span>
            </button>

            <router-link :to="`/viewPost`" class="flex items-center space-x-2 group" aria-label="View comments" @click.stop>
              <i class="ri-chat-1-line text-xl text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ post.comments_count || 0 }}
              </span>
            </router-link>
          </div>
        </div>

        <!-- Hashtags -->
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="tag in post.hashtags || []"
            :key="tag"
            :to="`/home`"
            class="text-sky-500 dark:text-sky-400 text-sm hover:underline"
            @click.stop
          >
            #{{ tag }}
          </router-link>
        </div>
      </div>
    </article>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { format } from 'date-fns';
import { useLanguageStore } from '@/stores/languageStore';

const { t } = useLanguageStore(); // Translation function
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const post = ref(null); // A reactive variable for resolved data

onMounted(async () => {
  if (props.post && props.post.then) {
    post.value = await props.post; // Resolve the promise
  } else {
    post.value = props.post; // Directly assign if it's not a promise
  }
});

const activeSlide = ref(0);
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
  return post.value && post.value.caption && post.value.caption.length > 100
    ? post.value.caption.slice(0, 100) + '...'
    : post.value?.caption || '';
});

const handleAvatarError = (e) => {
  e.target.src = '/default-avatar.png';
};
</script>