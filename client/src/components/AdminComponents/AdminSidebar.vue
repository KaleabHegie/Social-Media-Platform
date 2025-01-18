<template>
  <div
    class=" bg-white border-r border-gray-200 text-sky-500 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
    <!-- Logo -->
    <div class=" h-full flex flex-col justify-between">
      <div class="">
        <div class="flex items-center justify-center">
          <img src="@/assets/logo.png" alt="Logo" class="h-24 w-auto" />
        </div>

        <!-- Navigation -->
        <nav class="mt-5 border-t border-gray-200">
          <NavLink to="/userView" icon="ri-user-line" text="User View" />
          <NavLink to="/reportedPosts" icon="ri-file-list-line" text="Report View" />
          <NavLink to="/analytics" icon="ri-bar-chart-line" text="Analytics" />
        </nav>
      </div>

      <div class="border-t border-gray-200 ">
        <button @click="logout"
          class="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-sky-300 hover:text-white">
          <v-icon name="ri-logout-box-line" class="text-2xl font-bold" />
          <span class="text-lg font-semibold">Logout</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";
import NavLink from './NavLink.vue';
import { useRouter } from "vue-router";


const router = useRouter();

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push("/signin");
};
</script>