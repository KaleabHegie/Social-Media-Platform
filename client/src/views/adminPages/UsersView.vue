<template>
      <div class="space-y-6">
        <h1 class="text-2xl font-semibold text-sky-800">User Management</h1>
        
        <!-- Search Bar -->
        <div class="flex space-x-2">
          <div class="relative w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="w-full px-4 py-2 pl-10 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400"></i>
          </div>
          <button
            @click="searchUsers"
            class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition duration-300 flex items-center"
          >
            <i class="ri-search-line mr-2"></i>
            Search
          </button>
        </div>
  
        <!-- User List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UserCard
            v-for="user in filteredUsers"
            :key="user.user_name"
            :user="user"
            @edit="editUser"
            @delete="deleteUser"
          />
        </div>
      </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import AdminBaseLayout from '../AdminBaseLayout.vue';
  import UserCard from '../../components/AdminComponents/UserCard.vue';
  
  // Mock data based on the provided schema
  const users = ref([
    {
      user_name: 'johndoe',
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: '1990-01-01',
      gender: 'male',
      email: 'john@example.com',
      is_private: false,
      profile_photo_url: 'https://via.placeholder.com/150',
      bio: 'Software developer and tech enthusiast.',
      followers_count: 1000,
      following_count: 500,
      post_count: 50
    },
    {
      user_name: 'janedoe',
      first_name: 'Jane',
      last_name: 'Doe',
      date_of_birth: '1992-05-15',
      gender: 'female',
      email: 'jane@example.com',
      is_private: true,
      profile_photo_url: 'https://via.placeholder.com/150',
      bio: 'Digital artist and photographer.',
      followers_count: 1500,
      following_count: 300,
      post_count: 75
    },
    {
      user_name: 'bobsmith',
      first_name: 'Bob',
      last_name: 'Smith',
      date_of_birth: '1988-11-30',
      gender: 'male',
      email: 'bob@example.com',
      is_private: false,
      profile_photo_url: 'https://via.placeholder.com/150',
      bio: 'Travel blogger and adventure seeker.',
      followers_count: 800,
      following_count: 600,
      post_count: 30
    }
  ]);
  
  const searchQuery = ref('');
  
  const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    const query = searchQuery.value.toLowerCase();
    return users.value.filter(user => 
      user.user_name.toLowerCase().includes(query) ||
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });
  
  const searchUsers = () => {
    // This function can be expanded to fetch users from an API based on the search query
    console.log('Searching for:', searchQuery.value);
  };
  
  const editUser = (user) => {
    // In a real application, this would open a modal or navigate to an edit page
    console.log('Editing user:', user.user_name);
  };
  
  const deleteUser = (userName) => {
    // In a real application, this would send a request to the backend
    console.log('Deleting user:', userName);
    users.value = users.value.filter(user => user.user_name !== userName);
  };
  </script>
  
  