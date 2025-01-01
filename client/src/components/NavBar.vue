<template>
    <nav class="bg-gray-800 text-white p-4">
      <ul class="flex space-x-4">
        <li><router-link to="/home" class="hover:text-gray-400">Home</router-link></li>
        <li><router-link to="/explore" class="hover:text-gray-400">Explore</router-link></li>
        <li><router-link to="/account" class="hover:text-gray-400">Account</router-link></li>
        <li><router-link to="/createpost" class="hover:text-gray-400">Create Post</router-link></li>
        <li><router-link to="/messages" class="hover:text-gray-400">Messages</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
  };
  </script>
  
  <style scoped>
 
  </style>
  