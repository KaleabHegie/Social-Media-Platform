<template>
  <div>
    <NavBar /> <!-- Include NavBar here, only in the layout -->
    <main>
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
