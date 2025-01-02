<template>
  <div class="max-w-2xl mx-auto p-6 mt-20 mb-36  bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <h1 class="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white">Create New Post</h1>

    <!-- Post Type Selection -->
    <div class="flex gap-4 mb-6 justify-center">
      <button @click="postType = 'post'" :class="[
        'px-6 py-2 rounded-full transition-all',
        postType === 'post'
          ? 'bg-[#87CEEB] dark:bg-[#4FA4D3] text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      ]">
        <oh-vue-icon name="ri-layout-grid-line" class="inline-block mr-2 h-4 w-4" />
        Post
      </button>
      <button @click="postType = 'story'" :class="[
        'px-6 py-2 rounded-full transition-all',
        postType === 'story'
          ? 'bg-[#87CEEB] dark:bg-[#4FA4D3] text-white'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      ]">
        <oh-vue-icon name="ri-user-line" class="inline-block mr-2 h-4 w-4" />
        Story
      </button>
    </div>

    <!-- Media Upload -->
    <div class="mb-6">
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Upload Media (up to 4 media)</p>
      <div class="flex gap-6 mb-6">
        <label
          class="cursor-pointer flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-[#87CEEB] dark:bg-[#4FA4D3] text-white hover:bg-[#7BBED9] dark:hover:bg-[#458DB8] shadow-md transition-all">
          <input type="file" @change="handleFileUpload" accept="image/*,video/*" multiple class="hidden" />
          <oh-vue-icon name="ri-image-add-line" class="h-8 w-8" />
          <span class="mt-2 text-sm">Upload</span>
        </label>
        <button @click="startCamera"
          class="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-[#87CEEB] dark:bg-[#4FA4D3] text-white hover:bg-[#7BBED9] dark:hover:bg-[#458DB8] shadow-md transition-all">
          <oh-vue-icon name="ri-camera-line" class="h-8 w-8" />
          <span class="mt-2 text-sm">Camera</span>
        </button>
      </div>


      <!-- Media Preview -->
      <div v-if="mediaFiles.length > 0" class="grid grid-cols-2 gap-4">
        <div v-for="(media, index) in mediaFiles" :key="index"
          class="relative flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md">
          <!-- Media Name -->
          <div class="truncate text-gray-700 dark:text-gray-300">
            {{ media.name }}
          </div>

          <!-- Remove Button -->
          <button @click="removeMedia(index)"
            class="px-4 py-2 rounded-md bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700">
            <v-icon name="ri-close-line" class="h-4 w-4" />
          </button>

        </div>
      </div>

    </div>

    <!-- Caption -->
    <div v-if="postType === 'post'" class="mb-6">
      <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">Caption</label>
      <textarea v-model="caption" placeholder="Write a caption..."
        class="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#87CEEB] dark:focus:ring-[#4FA4D3] min-h-[120px]"></textarea>
    </div>

    <!-- Hashtags -->
    <div class="mb-6">
      <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">Hashtags</label>
      <div class="relative">
        <div class="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
          <input v-model="hashtagInput" @input="updateHashtagSuggestions" @keydown.enter.prevent="addCustomHashtag"
            placeholder="Add hashtags..."
            class="flex-grow p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#87CEEB] dark:focus:ring-[#4FA4D3]" />
          <button @click="addCustomHashtag"
            class="p-3 bg-[#87CEEB] dark:bg-[#4FA4D3] text-white hover:bg-[#7BBED9] dark:hover:bg-[#458DB8]">
            <oh-vue-icon name="ri-add-line" class="h-5 w-5" />
          </button>
        </div>
        <!-- Hashtag Suggestions -->
        <div v-if="hashtagSuggestions.length > 0"
          class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <button v-for="tag in hashtagSuggestions" :key="tag" @click="addHashtag(tag)"
            class="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
            #{{ tag }}
          </button>
        </div>
      </div>

      <!-- Selected Hashtags -->
      <div class="flex flex-wrap gap-2 mt-3">
        <span v-for="tag in selectedHashtags" :key="tag"
          class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white">
          #{{ tag }}
          <button @click="removeHashtag(tag)" class="ml-2">
            <oh-vue-icon name="ri-close-line" class="h-3 w-3" />
          </button>
        </span>
      </div>
    </div>

    <!-- Submit Button -->
    <button @click="submitPost"
      class="w-full py-3 bg-[#87CEEB] dark:bg-[#4FA4D3] text-white rounded-lg hover:bg-[#7BBED9] dark:hover:bg-[#458DB8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#87CEEB] dark:focus:ring-[#4FA4D3] focus:ring-offset-2">
      Submit Post
    </button>
  </div>

  <!-- Camera Modal -->
  <div v-if="showCamera" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-lg w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Take a Photo</h3>
        <button @click="stopCamera"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <oh-vue-icon name="ri-close-line" class="h-5 w-5" />
        </button>
      </div>
      <video ref="videoElement" class="w-full aspect-video bg-black rounded-lg mb-4"></video>
      <button @click="capturePhoto"
        class="w-full py-2 bg-[#87CEEB] dark:bg-[#4FA4D3] text-white rounded-lg hover:bg-[#7BBED9] dark:hover:bg-[#458DB8]">
        Capture
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  RiImageAddLine,
  RiCameraLine,
  RiCloseLine,
  RiLayoutGridLine,
  RiUserLine,
  RiAddLine,
} from "oh-vue-icons/icons";

addIcons(
  RiImageAddLine,
  RiCameraLine,
  RiCloseLine,
  RiLayoutGridLine,
  RiUserLine,
  RiAddLine,
);

// State
const postType = ref('post')
const mediaFiles = ref([])
const caption = ref('')
const hashtagInput = ref('')
const selectedHashtags = ref([])
const hashtagSuggestions = ref([])
const showCamera = ref(false)
const videoElement = ref(null)
const stream = ref(null)

// Assume we have a predefined array of hashtags
const availableHashtags = [
  'nature', 'photography', 'travel', 'food', 'fashion',
  'art', 'music', 'fitness', 'lifestyle', 'technology'
]

// Methods
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  if (mediaFiles.value.length + files.length > 4) {
    alert('You can only upload up to 4 media files')
    return
  }
  mediaFiles.value.push(...files)
}

const removeMedia = (index) => {
  mediaFiles.value.splice(index, 1)
}

const updateHashtagSuggestions = () => {
  if (!hashtagInput.value) {
    hashtagSuggestions.value = []
    return
  }

  const input = hashtagInput.value.toLowerCase().replace('#', '')
  hashtagSuggestions.value = availableHashtags
    .filter(tag =>
      tag.toLowerCase().includes(input) &&
      !selectedHashtags.value.includes(tag)
    )
    .slice(0, 5)
}

const addHashtag = (tag) => {
  if (!selectedHashtags.value.includes(tag)) {
    selectedHashtags.value.push(tag)
  }
  hashtagInput.value = ''
  hashtagSuggestions.value = []
}

const removeHashtag = (tag) => {
  selectedHashtags.value = selectedHashtags.value.filter(t => t !== tag)
}

const addCustomHashtag = () => {
  if (hashtagInput.value && !selectedHashtags.value.includes(hashtagInput.value)) {
    selectedHashtags.value.push(hashtagInput.value)
    hashtagInput.value = ''
    hashtagSuggestions.value = []
  }
}

// Camera handling
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
    showCamera.value = true
    nextTick(() => {
      if (videoElement.value) {
        videoElement.value.srcObject = stream.value
        videoElement.value.play()
      }
    })
  } catch (error) {
    console.error('Error accessing camera:', error)
    alert('Unable to access camera')
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  showCamera.value = false
}

const capturePhoto = () => {
  const canvas = document.createElement('canvas')
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  canvas.getContext('2d').drawImage(videoElement.value, 0, 0)

  canvas.toBlob(blob => {
    const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
    mediaFiles.value.push(file)
    stopCamera()
  }, 'image/jpeg')
}

const submitPost = () => {
  // Handle post submission
  console.log({
    type: postType.value,
    media: mediaFiles.value,
    caption: caption.value,
    hashtags: selectedHashtags.value
  })
}

// Cleanup
onUnmounted(() => {
  stopCamera()
})
</script>
