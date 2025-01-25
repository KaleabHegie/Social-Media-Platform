<template>
  <div class="bg-white shadow-md rounded-lg p-4 mb-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-sky-800">Post ID: {{ reportedPost?.post?._id }}
      </h3>
      <div class="flex gap-3">
        <button @click="deletePost" class="text-red-500 hover:text-red-700">
          <i class="ri-delete-bin-line text-xl"></i>
        </button>
      </div>
    </div>
    <router-link :to="`/viewPost/${reportedPost?.post?._id}`" tag="a" target="_blank"
      class="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition duration-300">
      Preview
    </router-link>
    <div class="space-y-3 mt-4 min-h-[300px] overflow-y-auto">
      <div v-for="user in reportedPost.reportedBy" :key="user._id"
        class="flex items-center space-x-3 rounded-lg shadow-md bg-red-50 p-2">
        <img :src="user.profile_photo_url || '/default-avatar.png'" :alt="user.user_name"
          class="w-10 h-10 rounded-full object-cover">
        <div class="w-full">
          <router-link :to="`/viewAccount/${user._id}`" tag="a" target="_blank" class="hover:underline">
            <p class="font-medium text-sky-600">{{ user.user_name }}</p>
          </router-link>
          <div class="flex justify-between">
            <p class="text-sm text-gray-600">{{ user.reason }}</p>
            <i class="ri-flag-2-fill text-red-300"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAdminStore } from "@/stores/adminStore";

// AdminStore
const adminStore = useAdminStore();


const props=defineProps({
  reportedPost: {
    type: Object,
    required: true
  },
});

const deletePost = async () => {
  console.log(props.reportedPost?.post?._id)
  await adminStore.deleteReportedPost(props.reportedPost?.post?._id);
};


</script>
