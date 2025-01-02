<template>
  <div class="flex">
    <NavBar /> <!-- Include NavBar  -->
    <main class="bg-red-100 flex-1 lg:ml-64 min-h-screen">
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
