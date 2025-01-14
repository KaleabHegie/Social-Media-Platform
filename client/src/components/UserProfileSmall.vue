<template>
  <div class="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
    <router-link :to="`/viewAccount/${follow.user._id}`" class="flex items-center group">
      <div class="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
        <img
          :src="follow.user.profile_photo_url || 'https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill'"
          alt="User Avatar"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="ml-3">
        <h2 class="text-gray-800 dark:text-white font-semibold group-hover:underline">
          {{ follow.user.user_name }}
        </h2>
        <h6 class="text-gray-600 dark:text-gray-400">{{ follow.user.first_name }} {{ follow.user.last_name }}</h6>
      </div>
    </router-link>

    <!-- Delete Account Button -->
    <button @click="openModal" class="ml-auto text-red-600">Delete Account</button>
    
    <!-- Confirmation Modal -->
    <ConfirmationModal 
      :isVisible="isModalVisible" 
      @confirm="deleteAccount" 
      @cancel="closeModal" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue'; // Import your modal component

defineProps({
  follow: {
    type: Object,
    required: true,
  },
});

const isModalVisible = ref(false); // State to control modal visibility

// Opens the modal
const openModal = () => {
  isModalVisible.value = true;
};

// Closes the modal
const closeModal = () => {
  isModalVisible.value = false;
};

// Handles account deletion
const deleteAccount = () => {
  console.log("Account deleted for:", follow.user.user_name);
  // You can add your delete account logic here (e.g., call an API to delete the account)
  closeModal(); // Close the modal after confirming the delete
};
</script>

<style scoped>
/* Your styles */
</style>
