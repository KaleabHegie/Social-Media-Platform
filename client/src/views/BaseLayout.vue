<template>
  <div class="flex">
    <NavBar /> <!-- Include NavBar here, only in the layout -->
    <main class="bg-red-100 p-4 flex-1 lg:ml-64"> <!-- flex-1 ensures full width on small screens, ml-64 adds space when sidebar is visible on large screens -->
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
