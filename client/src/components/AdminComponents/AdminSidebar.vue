<template>
    <div class="bg-[#f8f4f4] text-sky-300 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
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
    </div>
  </template>
  
  <script setup>
  import NavLink from './NavLink.vue';
  </script>
  
  