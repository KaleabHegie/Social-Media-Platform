<!-- ConfirmationModal.vue -->
<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <h3>Are you sure you want to delete your account?</h3>
      <div class="modal-actions">
        <button @click="onConfirm">Yes, delete it</button>
        <button @click="onCancel">Cancel</button>
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
}

.modal-actions button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: red;
  color: white;
}

.modal-actions button:last-child {
  background-color: gray;
  color: white;
}
</style>
