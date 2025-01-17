<template>
  <div
    class="bg-[#f8f4f4] text-sky-300 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
    <!-- Logo -->
    <div class="flex items-center justify-center">
      <img src="@/assets/logo.png" alt="Logo" class="h-12 w-auto" />
    </div>

    <!-- Navigation -->
    <nav>
      <NavLink to="/userView" icon="ri-user-line" text="User View" />
      <NavLink to="/reportedPosts" icon="ri-file-list-line" text="Report View" />
      <NavLink to="/analytics" icon="ri-bar-chart-line" text="Analytics" />
    </nav>
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <button @click="logout"
        class="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-sky-300 hover:text-white">
        <v-icon name="ri-logout-box-line" class="text-2xl font-bold" />
        <span class="text-lg font-semibold">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import NavLink from './NavLink.vue';
</script>