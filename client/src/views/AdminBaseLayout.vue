<template>
  <div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <AdminSidebar />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-white">
        <div class="container mx-auto px-6 py-8">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '../components/AdminComponents/AdminSidebar.vue';
</script>

