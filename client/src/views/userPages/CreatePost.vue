<template>
  <div class="min-h-screen bg-sky-100 dark:bg-gray-900 pt-4 pb-20 px-4 flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Create New Post</h1>
      
      <!-- Post Type Toggle -->
      <div class="mb-6 flex justify-center">
        <label for="post-type-toggle" class="flex items-center cursor-pointer">
          <div class="relative">
            <input type="checkbox" id="post-type-toggle" class="sr-only" v-model="isStory">
            <div class="w-14 h-7 bg-gray-200 rounded-full shadow-inner"></div>
            <div class="dot absolute w-7 h-7 bg-white rounded-full shadow -left-1 -top-1 transition" 
                 :class="{ 'transform translate-x-full bg-sky-500': isStory }"></div>
          </div>
          <div class="ml-3 text-gray-700 dark:text-gray-300 font-medium">
            {{ isStory ? 'Story' : 'Post' }}
          </div>
        </label>
      </div>

      <!-- Media Upload -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
          Upload Media ({{ isStory ? '1 media' : 'up to 4 media' }})
        </label>
        <div class="flex justify-center space-x-4 mb-2">
          <button
            @click="openCamera"
            class="flex items-center justify-center w-12 h-12 bg-sky-500 text-white rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            <v-icon name="ri-camera-line" class="w-6 h-6" />
          </button>
          <label class="flex items-center justify-center w-12 h-12 bg-sky-500 text-white rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 cursor-pointer">
            <v-icon name="ri-image-line" class="w-6 h-6" />
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*,video/mp4"
              :multiple="!isStory"
              class="hidden"
            >
          </label>
        </div>
        
        <!-- Drag and Drop Area -->
        <div
          @dragover.prevent
          @drop.prevent="handleDrop"
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-sky-500 transition duration-300 mb-4"
        >
          <v-icon name="ri-upload-cloud-line" class="w-12 h-12 mx-auto text-gray-400" />
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag and drop your files here, or click to select files
          </p>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*,video/mp4"
            :multiple="!isStory"
            class="hidden"
            ref="fileInput"
          >
        </div>

        <!-- Thumbnail Previews -->
        <div v-if="mediaFiles.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div v-for="(file, index) in mediaFiles" :key="index" class="relative">
            <img v-if="file.type.startsWith('image')" :src="URL.createObjectURL(file)" alt="Uploaded media" class="w-full h-24 object-cover rounded-md">
            <video v-else-if="file.type === 'video/mp4'" :src="URL.createObjectURL(file)" class="w-full h-24 object-cover rounded-md"></video>
            <button @click="removeMedia(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <v-icon name="ri-close-line" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Caption -->
      <div class="mb-6">
        <label for="caption" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Caption</label>
        <textarea
          id="caption"
          v-model="caption"
          rows="3"
          class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-sky-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          placeholder="Write a caption..."
        ></textarea>
      </div>

      <!-- Hashtags (only for posts) -->
      <div v-if="!isStory" class="mb-6">
        <label for="hashtags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hashtags</label>
        <div class="flex space-x-2">
          <div class="relative flex-grow">
            <input
              id="hashtags"
              v-model="currentHashtag"
              @input="updateHashtagSuggestions"
              @keydown.enter.prevent="addHashtag"
              type="text"
              class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-sky-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              placeholder="Add hashtags..."
            >
            <div v-if="hashtagSuggestions.length > 0" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
              <ul>
                <li
                  v-for="suggestion in hashtagSuggestions"
                  :key="suggestion"
                  @click="selectHashtag(suggestion)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  #{{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
          <button
            @click="addHashtag"
            class="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
        <div v-if="hashtags.length > 0" class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="tag in hashtags"
            :key="tag"
            class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200"
          >
            #{{ tag }}
            <button @click="removeHashtag(tag)" class="ml-1 focus:outline-none">
              <v-icon name="ri-close-line" class="w-4 h-4" />
            </button>
          </span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        @click="submitPost"
        :disabled="!isFormValid"
        class="w-full px-4 py-2 text-white bg-sky-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <v-icon name="ri-send-plane-fill" class="w-5 h-5 mr-2" />
        Submit {{ isStory ? 'Story' : 'Post' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isStory = ref(false);
const mediaFiles = ref([]);
const caption = ref('');
const currentHashtag = ref('');
const hashtags = ref([]);
const hashtagSuggestions = ref([]);
const fileInput = ref(null);

// Sample hashtag recommendations
const recommendedHashtags = [
  'nature', 'travel', 'food', 'fashion', 'art', 'photography', 'fitness', 'music',
  'technology', 'sports', 'beauty', 'lifestyle', 'motivation', 'health', 'business'
];

const isFormValid = computed(() => {
  return mediaFiles.value.length > 0 && 
         (isStory.value ? mediaFiles.value.length === 1 : mediaFiles.value.length <= 4) &&
         caption.value.trim() !== '';
});

const openCamera = () => {
  // Implement camera functionality here
  console.log('Opening camera...');
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  addFiles(files);
};

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files);
  addFiles(files);
};

const addFiles = (files) => {
  const validFiles = files.filter(file => 
    file.type.startsWith('image/') || file.type === 'video/mp4'
  );

  if (isStory.value && validFiles.length > 1) {
    alert('You can only upload 1 media file for a story.');
    return;
  }

  if (!isStory.value && mediaFiles.value.length + validFiles.length > 4) {
    alert('You can only upload up to 4 media files for a post.');
    return;
  }

  mediaFiles.value = isStory.value 
    ? [validFiles[0]] 
    : [...mediaFiles.value, ...validFiles].slice(0, 4);
};

const removeMedia = (index) => {
  mediaFiles.value.splice(index, 1);
};

const updateHashtagSuggestions = () => {
  if (currentHashtag.value.startsWith('#')) {
    currentHashtag.value = currentHashtag.value.slice(1);
  }
  if (currentHashtag.value) {
    hashtagSuggestions.value = recommendedHashtags
      .filter(tag => tag.toLowerCase().startsWith(currentHashtag.value.toLowerCase()))
      .slice(0, 5);
  } else {
    hashtagSuggestions.value = [];
  }
};

const addHashtag = () => {
  if (currentHashtag.value && !hashtags.value.includes(currentHashtag.value)) {
    hashtags.value.push(currentHashtag.value);
    currentHashtag.value = '';
    hashtagSuggestions.value = [];
  }
};

const selectHashtag = (tag) => {
  if (!hashtags.value.includes(tag)) {
    hashtags.value.push(tag);
  }
  currentHashtag.value = '';
  hashtagSuggestions.value = [];
};

const removeHashtag = (tag) => {
  hashtags.value = hashtags.value.filter(t => t !== tag);
};

const submitPost = () => {
  if (!isFormValid.value) return;

  const post = {
    type: isStory.value ? 'story' : 'post',
    media: mediaFiles.value.map(file => URL.createObjectURL(file)),
    caption: caption.value,
    hashtags: isStory.value ? [] : hashtags.value,
    createdAt: new Date().toISOString()
  };

  // Here you would typically send the post data to your backend API
  console.log('Submitting post:', post);

  // Reset form
  isStory.value = false;
  mediaFiles.value = [];
  caption.value = '';
  hashtags.value = [];
  currentHashtag.value = '';

  // Show success message or redirect user
  alert('Post submitted successfully!');
};
</script>

<style scoped>
/* Toggle button styles */
.dot {
  transition: all 0.3s ease-in-out;
}
input:checked ~ .dot {
  transform: translateX(100%);
}
</style>

