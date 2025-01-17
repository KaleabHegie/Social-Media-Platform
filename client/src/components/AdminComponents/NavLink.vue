<template>
    <router-link :to=to class="block py-2.5 px-4 rounded transition duration-200 hover:bg-sky-300 hover:text-white">
      <div class="flex items-center">
        <i :class="icon" class="text-xl"></i>
        <span class="ml-4 md:inline hidden">{{ text }}</span>
      </div>
    </router-link>
  </template>
  
  <script setup>
  defineProps({
    to: String,
    icon: String,
    text: String
  });
  </script>
  
  