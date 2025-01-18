<template>
  <div class="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
        <img :src="user.profile_photo_url || '/default-avatar.png'" :alt="user.user_name"
          class="w-16 h-16 rounded-full object-cover">
        <div>
          <router-link :to="`/viewAccount/${user._id}`" tag="a" target="_blank" class="hover:underline">
            <h3 class="text-lg font-semibold text-sky-800">{{ user.first_name }} {{ user.last_name }}</h3>
            <p class="text-sky-600">@{{ user.user_name }}</p>
          </router-link>
          <div class="flex items-center mt-2 space-x-2">
            <span class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="user.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
              {{ user.is_verified ? "Verified User" : "Unverified User" }}
            </span>
            <button @click="onVerify(user._id)"
              class="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-white rounded-lg"
              :class="user.is_verified ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'">
              <i :class="user.is_verified ? 'ri-close-circle-line' : 'ri-check-line'"></i>
              {{ user.is_verified ? "Remove Verification" : "Verify User" }}
            </button>
          </div>
        </div>

      </div>
      <div class="flex space-x-2">


        <button @click="onDelete(user._id)" class="text-red-500 hover:text-red-700">
          <i class="ri-delete-bin-line text-xl"></i>
        </button>


      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="text-gray-600">Email:</p>
        <p class="font-medium">{{ user.email }}</p>
      </div>
      <div>
        <p class="text-gray-600">Date of Birth:</p>
        <p class="font-medium">{{ formatDate(user.date_of_birth) }}</p>
      </div>
      <div>
        <p class="text-gray-600">Gender:</p>
        <p class="font-medium capitalize">{{ user.gender || 'Not specified' }}</p>
      </div>
      <div>
        <p class="text-gray-600">Account Type:</p>
        <p class="font-medium">{{ user.is_private ? 'Private' : 'Public' }}</p>
      </div>
    </div>
    <div class="border-t pt-4">
      <p class="text-gray-600 mb-2">Bio:</p>
      <p class="text-gray-800">{{ user.bio || 'No bio provided.' }}</p>
    </div>
    <div class="flex justify-between mt-4 text-sky-700">
      <div>
        <i class="ri-user-follow-line mr-1"></i>
        <span>{{ user.followers_count }} followers</span>
      </div>
      <div>
        <i class="ri-user-shared-line mr-1"></i>
        <span>{{ user.following_count }} following</span>
      </div>
      <div>
        <i class="ri-image-line mr-1"></i>
        <span>{{ user.post_count }} posts</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  onDelete: Function,
  onVerify: Function,
});


function formatDate(dateString) {
  if (!dateString) return 'Not provided';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>
