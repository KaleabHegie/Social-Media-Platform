<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <h3 class="text-gray-800 dark:text-white">Are you sure you want to delete your account?</h3>
      <div class="modal-actions">
        <button @click="onConfirm" class="bg-red-500 text-white hover:bg-red-700">Yes, delete it</button>
        <button @click="onCancel" class="bg-gray-500 text-white hover:bg-gray-700">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
  },
  methods: {
    onConfirm() {
      this.$emit('confirm');
    },
    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-actions button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-actions button:first-child {
  background-color: red;
  color: white;
}

.modal-actions button:last-child {
  background-color: gray;
  color: white;
}

/* Dark Mode Styles */
.dark .modal {
  background-color: #2d2d2d;
}

.dark .modal h3 {
  color: white;
}

.dark .modal-actions button:first-child {
  background-color: #e3342f; /* Tailwind's red-600 */
}

.dark .modal-actions button:last-child {
  background-color: #6b7280; /* Tailwind's gray-600 */
}
</style>
