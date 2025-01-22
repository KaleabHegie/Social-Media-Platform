<template>
  <article
    class="bg-white  dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <!-- Carousel Section -->

    <div class="relative fade-mask">
      <!-- User Info Overlay -->
      <div class="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div class="flex items-center">
          <router-link :to="`/viewAccount/${props.post.user._id}`" class="flex items-center group" @click.stop>
            <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img :src="props.post.user.profile_photo_url || '/default-avatar.png'" :alt="props.post.user.user_name"
                class="w-full h-full object-cover" @error="handleAvatarError" />
            </div>
            <div class="ml-3">
              <h2 class="text-white text-lg font-semibold group-hover:underline">
                {{ props.post.user.user_name }}
                <i v-if="props.post.user.is_verified"
                  class="ri-check-line bg-sky-500 rounded-full text-white p-1 text-xs hover:no-underline ml-2"></i>
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
        <div v-if="post.medias && post.medias.length" class="flex transition-transform duration-300 ease-in-out "
          :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
          <div v-for="(media, index) in post.medias" :key="index" class="w-full  flex-shrink-0">
            <template v-if="media.endsWith('.mp4') || media.endsWith('.webm')">
              <video :src="media" autoplay controls loop class="w-full max-h-[800px] object-contain"></video>
            </template>
            <template v-else>
              <img :src="media" alt="Media" class="w-full max-h-[800px] object-contain" />
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
            :class="index === activeSlide ? 'bg-white' : 'bg-white/50'"></button>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-4">
      <router-link :to="`/viewpost/${props.post._id}`" class="block">
        <div class="mb-4">
          <p v-if="showFullCaption" class="text-gray-800 dark:text-white">
            {{ props.post.caption || '' }}
          </p>
          <p v-else class="text-gray-800 dark:text-white">
            {{ truncatedCaption }}
          </p>
          <button v-if="props.post.caption && props.post.caption.length > 100" @click.stop.prevent="toggleCaption"
            class="text-sky-500 dark:text-sky-400 text-sm mt-2">
            {{ showFullCaption ? t('readLess') : t('readMore') }}
          </button>
        </div>
      </router-link>

      <div class="flex items-center justify-between mb-4">
        <!-- Like and Comment Buttons -->
        <div class="flex items-center space-x-4">
          <button @click.stop.prevent="toggleLike" class="flex items-center space-x-2 group"
            :aria-label="isLiked ? 'Unlike post' : 'Like post'">
            <i :class="['ri-thumb-up-line', isLiked ? 'text-sky-500' : 'text-gray-600 dark:text-gray-400']"
              class="text-xl group-hover:scale-110 transition-transform"></i>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ likesCount || 0 }}</span>
          </button>

          <router-link :to="`/viewpost/${post._id}`" class="flex items-center space-x-2 group"
            aria-label="View comments">
            <i
              class="ri-chat-1-line text-xl text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform"></i>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ props.post.comments_count || 0 }}</span>
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Flag Button -->
          <button v-if="!isPostOwner" @click.stop.prevent="showFlagModal = true"
            class="flex items-center space-x-2 group" aria-label="Flag post">
            <i
              class="ri-flag-line text-xl text-gray-600 dark:text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-transform"></i>
          </button>

          <!-- Delete Button -->
          <button v-if="canDelete" @click.stop.prevent="showDeleteModal = true"
            class="flex items-center space-x-2 group" aria-label="Delete post">

            <i
              class="ri-delete-bin-line text-xl text-gray-600 dark:text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-transform"></i>
          </button>
        </div>
      </div>
        <!-- Hashtags -->
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="tag in props.post.hashtags || []"
            :key="tag"
            :to="`/home`"
            class="text-sky-500 dark:text-sky-400 text-sm hover:underline"
            @click.stop
          >
            #{{ tag }}
          </router-link>
        </div>

      <!-- Flag Confirmation Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showFlagModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transform transition-all">
              <h3 class="text-lg mb-4 text-gray-800 dark:text-white">Are you sure you want to flag this post?</h3>
              <!-- Dropdown for Report Reason -->
              <div v-if="showDropdown" class="mb-4">
                <label for="reportReason" class="block text-sm text-gray-700 dark:text-white">Please select a reason for
                  flagging:</label>
                <select v-model="selectedReason" id="reportReason" class="w-full mt-2 p-2 border rounded-md">
                  <option disabled value="">-- Select a reason --</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="spam">Spam</option>
                  <option value="hate_speech">Hate Speech</option>
                  <option value="harassment">Harassment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Buttons -->
              <div class="flex justify-between">
                <button @click="confirmFlag" :disabled="!selectedReason"
                  class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                  Yes, flag it
                </button>
                <button @click="cancelAction('flag')"
                  class="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>


      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div class="  max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transform transition-all">
              <h3 class="text-lg text-gray-900 dark:text-white mb-4">Are you sure you want to delete this post?</h3>
              <div class="flex justify-between">
                <button @click="confirmDelete" class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700">
                  Yes, delete it
                </button>
                <button @click="cancelAction('delete')"
                  class="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </article>
</template>


<script setup>
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import { useLanguageStore } from '@/stores/languageStore';

import { usePostStoryStore } from '@/stores/homePageStore';
import { useAuthStore } from '@/stores/authStore';

import ToastService from '@/utils/toast.js';


import { useRouter } from 'vue-router';

const toast = ToastService();

const store = usePostStoryStore()
const showFlagModal = ref(false);
const showDeleteModal = ref(false);
const selectedReason = ref('');   // Stores the selected reason from the dropdown
const showDropdown = ref(true);
// Method to handle the modal cancel action
function cancelAction(action) {
  if (action === 'flag') {
    showFlagModal.value = false; // Close the modal
    selectedReason.value = '';   // Reset selected reason
  } else if (action === 'delete') {  // Change actionType to action here
    showDeleteModal.value = false;  // Close the delete modal
  }
}

// Method to confirm flagging
function confirmFlag() {
  if (selectedReason.value) {
    // You can call your API or perform any action related to flagging the post
    console.log(`Post flagged for reason: ${selectedReason.value}`);

    // Close the modal after flagging
    showFlagModal.value = false;
    selectedReason.value = ''; // Reset selected reason
  }
}

// You can invoke this method when you want to show the flag modal
function showFlagConfirmation() {
  showFlagModal.value = true;  // Show the modal
}


const authStore = useAuthStore()


const { t } = useLanguageStore(); // Translation function
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const activeSlide = ref(0);
let likesCount = ref(props.post.likes_count)

const isUserNotLiked = !props.post.likes.some(like => like.userId === authStore.user.id);


const goToSlide = (index) => {
  activeSlide.value = index
}


const router = useRouter();

const confirmDelete = async () => {
  const response = await store.deletePost(props.post._id)
  console.log(props.post._id)
  router.push('/home');
  toast.success('Post Deleted Successfully!', { position: 'top-center' });
  showDeleteModal.value = false; // Close the modal after confirmation
};

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
const canDelete = computed(() => {
  // Allow delete if the user is the post owner or an admin
  return authStore.user.id === props.post.user._id || authStore.user.role === 'admin';
});
const isPostOwner = computed(() => {
  return authStore.user.id === props.post.user._id; // Check if the logged-in user owns the post
});

const isLiked = ref(!isUserNotLiked);

const formatDate = (date) => {
  const formattedDate = new Date(date);
  if (isNaN(formattedDate)) {
    return ''; // Return empty string if the date is invalid
  }
  return format(formattedDate, 'MMM d, yyyy • HH:mm');
};

const toggleLike = async () => {
  isLiked.value = !isLiked.value;
  await store.likeDislike(props.post._id);
  if (isLiked.value) {
    likesCount.value += 1
  }
  else {
    likesCount.value -= 1
  }
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
