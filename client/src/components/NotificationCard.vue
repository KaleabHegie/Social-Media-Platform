<template>
  <div class="mt-3 w-full h-[400px] overflow-y-scroll bg-gray-300">
    <div class="flex justify-between items-center">
      <router-link v-if="showCloseButton" to="/home"
        class="ml-4 bg-white text-red-500 px-2 py-1 rounded font-bold hover:bg-gray-200 transition">
        Close
      </router-link>
    </div>
    <p>Notificationnnnn</p>
  </div>
</template>

<script setup>

const props = defineProps({
  showCloseButton: {
    type: Boolean,
    default: false,
  },
});

</script>
