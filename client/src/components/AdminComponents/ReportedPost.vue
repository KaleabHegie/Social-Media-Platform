<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-sky-800">Post ID: {{ post.postId }}</h3>
      <div class="flex gap-3">
        <button @click="$emit('delete', post.postId)" class="text-red-500 hover:text-red-700">
          <i class="ri-delete-bin-line text-xl"></i>
        </button>
        <button @click="$emit('delete', post.postId)" class="text-red-500 hover:text-red-700">
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>
    <div class="space-y-3">
      <div v-for="user in post.users" :key="user.userId" class="flex items-center space-x-3">
        <img :src="user.avatarUrl" :alt="user.username" class="w-10 h-10 rounded-full object-cover">
        <div>
          <p class="font-medium text-sky-600">{{ user.username }}</p>
          <p class="text-sm text-gray-600">{{ user.reason }}</p>
        </div>
      </div>
    </div>
    <button @click="$emit('view', post)"
      class="mt-4 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition duration-300">
      View Post
    </button>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
});

defineEmits(['delete', 'view']);
</script>
