<template>
    <div v-if="post" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-sky-800">Post Details</h2>
            <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
              <i class="ri-close-line text-2xl"></i>
            </button>
          </div>
          <div class="space-y-4">
            <p class="text-gray-600"><span class="font-semibold">Post ID:</span> {{ post.postId }}</p>
            <div class="border-t pt-4">
              <h3 class="font-semibold text-lg mb-2">Content:</h3>
              <p class="text-gray-800">{{ post.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    post: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['close']);
  </script>
  
  