<template>
    <div class="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <router-link :to="`/user/placeholder_username`" class="flex items-center group">
        <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <img
            src="https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill"
            alt="User Avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="ml-3">
          <h2 class="text-gray-800 dark:text-white font-semibold group-hover:underline">
            user_name_1
          </h2>
          <h6 class="text-gray-600 dark:text-gray-400">John Doe</h6>
        </div>
      </router-link>
    </div>
  </template>
  
  <script setup>
  defineProps({});
  </script>
  
  <style scoped></style>
  