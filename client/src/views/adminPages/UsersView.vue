<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-sky-800">User Management</h1>

    <!-- Search Bar -->
    <div class="flex space-x-2">
      <div class="relative w-64">
        <input v-model="searchQuery" type="text" placeholder="Search users..."
          class="w-full px-4 py-2 pl-10 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300" />
        <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400"></i>
      </div>
      <button @click="fetchUsers"
        class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition duration-300 flex items-center">
        <i class="ri-search-line mr-2"></i>
        Search
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center text-sky-600">
      <i class="ri-loader-4-line animate-spin text-3xl"></i>
      <p>Loading...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- User List -->
    <div v-if="!isLoading && !error && users.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UserCard v-for="user in users" :key="user._id" :user="user" :onDelete="deleteUser" :onVerify="VerifyUser" />
    </div>

    <!-- No Results Found -->
    <div v-if="!isLoading && !error && users.length === 0" class="text-center text-gray-500">
      <p>No users found. Try refining your search.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAdminStore } from "@/stores/adminStore";
import UserCard from "../../components/AdminComponents/UserCard.vue";
import ToastService from "../../utils/toast";

const toast = ToastService();
// AdminStore
const adminStore = useAdminStore();

// Local State
const searchQuery = ref("");

// Reactive Bindings
const users = computed(() => adminStore.users);
const isLoading = computed(() => adminStore.isLoading);
const error = computed(() => adminStore.error);

// Fetch Users
const fetchUsers = async () => {
  console.log("Fetching users with query:", searchQuery.value);
  await adminStore.getUserDataAdmin(searchQuery.value);
};

const deleteUser = async (userId) => {
  await adminStore.deleteAccountAdmin(userId);
};

const VerifyUser = async (userId) => {
  await adminStore.markAsVerifiedAdmin(userId);
};

// Fetch Users on Component Mount
onMounted(() => {
  console.log("Component mounted, fetching initial data...");
  adminStore.getUserDataAdmin();
});
</script>
