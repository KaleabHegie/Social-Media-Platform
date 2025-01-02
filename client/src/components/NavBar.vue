<template>
  <div>
    <!-- Sidebar for desktop -->
    <div
      class="hidden lg:flex lg:w-64 lg:h-screen lg:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed top-0 left-0 transition-colors duration-300">
      <!-- Logo section -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col items-center justify-between h-full p-1 ">
          <img src="@/assets/logo.png" alt="Logo" class="w-[120px]" />
        </div>
      </div>

      <!-- Navigation links -->
      <nav class="flex-1 p-4">
        <ul class="flex flex-col space-y-2">
          <li v-for="item in navItems" :key="item.path">
            <router-link :to="item.path"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              :class="{ 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400': isActive(item.path) }">
              <v-icon :name="item.icon" class="text-2xl font-bold"
                :class="isActive(item.path) ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'" />
              <span class="text-lg font-semibold">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Dark Mode Toggleer and change language -->
      <div class="flex items-center space-x-4 m-3">
        <LanguageSelector />
        <DarkModeToggle />
      </div>

      <!-- Logout button -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <button @click="logout"
          class="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <v-icon name="ri-logout-box-line" class="text-2xl font-bold text-gray-500 dark:text-gray-400" />
          <span class="text-lg font-semibold">Logout</span>
        </button>
      </div>

    </div>

    <!-- Floating bottom navbar for mobile -->
    <div class="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav
        class="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <ul class="flex justify-around items-center">
          <li v-for="item in navItems" :key="item.path">
            <router-link :to="item.path"
              class="flex flex-col items-center p-3 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              :class="{ 'text-sky-600 dark:text-sky-400': isActive(item.path) }">
              <v-icon :name="item.icon" class="text-2xl font-bold mb-1"
                :class="isActive(item.path) ? 'text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'" />
            </router-link>
          </li>
        </ul>
      </nav>
    </div>


  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';
import LanguageSelector from '@/components/LanguageSelector.vue';


// Navigation items with Oh Vue Icons
const navItems = [
  { name: 'Home', path: '/home', icon: 'ri-home-line' },
  { name: 'Explore', path: '/explore', icon: 'ri-compass-line' },
  { name: 'Create Post', path: '/createpost', icon: 'ri-add-box-line' },
  { name: 'Messages', path: '/messages', icon: 'ri-message-2-line' },
  { name: 'Account', path: '/account', icon: 'ri-user-line' }
];

const route = useRoute();

// Check if route is active
const isActive = (path) => {
  return route.path === path;
};

// Logout function
const logout = () => {
  // Implement logout logic here
  console.log('Logging out...');
};
</script>

<style scoped>
/* Add smooth transition for router link active state */
.router-link-active {
  transition: all 0.3s ease;
}

/* Custom shadow for floating navbar */
.shadow-lg {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>