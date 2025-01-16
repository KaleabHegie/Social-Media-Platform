<template>
  <div class="flex">
    <NavBar /> <!-- Include NavBar  -->
    <main class="flex-1 overflow-hidden lg:ml-64 min-h-screen bg-gradient-to-br from-[#ffffff] to-[#f3eeee] dark:from-gray-800 dark:to-gray-900">
      <router-view></router-view> <!-- This will render the child components -->
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'BaseLayout',
  components: {
    NavBar, // Register NavBar to be used inside this layout
  },
};


</script>

<style scoped>
/* Add any custom styles here */
</style>
