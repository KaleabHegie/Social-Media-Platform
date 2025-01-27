<template>
    <div class="flex items-center bg-light dark:bg-gray-800 p-4 rounded-lg shadow-lg mt2">
      <router-link :to="`/viewAccount/${request.user._id}`" class="flex items-center group">
        <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <img
            :src="request.user.profile_photo_url || 'https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill'"
            alt="User Avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="ml-3">
          <h2 class="text-gray-800 dark:text-white font-semibold group-hover:underline">
            {{ request.user.user_name }}
            <i v-if="request.user.is_verified" class="ri-check-line bg-sky-500 rounded-full text-white p-1 text-xs hover:no-underline ml-2"></i>
          </h2>
          <h6 class="text-gray-600 dark:text-gray-400">{{ request.user.first_name }} {{ request.user.last_name }}</h6>
        </div>

      
      </router-link>
      <div class="flex justify-end mt-2 p-2 m-1"> <!-- Wrapper to align button to the right -->
                <button  @click="acceptRequest(request._id)"
                  class="bg-sky-400 dark:bg-sky-700 hover:bg-sky-400 dark:hover:bg-sky-600 text-white px-3 p-1 rounded">
                  Accept
                </button>
              </div>
    </div>
  </template>
  
  <script setup>
  import { usePostStoryStore } from '../stores/homePageStore';
  import ToastService from '@/utils/toast.js';
  defineProps({
    request: {
      type: Object,
      required: true,
    },
  });


  const store = usePostStoryStore()
  const toast = ToastService();

const acceptRequest = async (request) => {
   await store.acceptRequest(request)
   toast.success("Request accepted successfully!" , { position: "top-center" });
   

};
  
  </script>
  
