<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-sky-800">Reported Posts</h1>
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center text-sky-600">
      <i class="ri-loader-4-line animate-spin text-3xl"></i>
      <p>Loading...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>


    <div v-if="!isLoading && !error && reportedPosts.length === 0" class="text-center py-10">
      <i class="ri-file-list-3-line text-5xl text-gray-400 mb-4"></i>
      <p class="text-xl text-gray-600">No reported posts at the moment.</p>
    </div>

    <div v-else-if="!isLoading && !error" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ReportedPost v-for="reportedPost in reportedPosts" :key="reportedPost.post?.postId" :reportedPost="reportedPost"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import ReportedPost from '../../components/AdminComponents/ReportedPost.vue';

// AdminStore
const adminStore = useAdminStore();

// Reactive Bindings
const reportedPosts = computed(() => adminStore.reportedPosts);
const isLoading = computed(() => adminStore.isLoading);
const error = computed(() => adminStore.error);

  

// Fetch Users on Component Mount
onMounted(() => {
  console.log("Component mounted, fetching initial data...");
   adminStore.getReportedPosts();
  console.log(reportedPosts.value);
});
</script>
