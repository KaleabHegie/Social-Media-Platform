<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Loading or Error State -->
    <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-400">
      Loading profile...
    </div>
    <div v-else-if="!profile" class="text-center text-gray-500 dark:text-gray-400">
      No profile data available.
    </div>

    <!-- Profile Content -->
    <div v-else>
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <!-- Profile Photo -->
          <div class="relative">
            <img :src="profile.profile_photo_url" alt="Profile Photo"
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover">
            <button @click="editProfilePhoto"
              class="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 sm:p-2 text-white">
              <PencilIcon class="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          <!-- User Info -->
          <div class="flex-grow text-center sm:text-left">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {{ profile.first_name }} {{ profile.last_name }}
            </h1>
            <p class="text-gray-600 dark:text-gray-300">@{{ profile.user_name }}</p>

            <!-- Follow/Unfollow and Message Buttons -->
            <div class="mt-3 space-x-2">
              <button @click="toggleFollow"
                class="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded-md hover:bg-blue-600 transition duration-300">
                {{ isFollowing ? 'Unfollow' : 'Follow' }}
              </button>
              <button @click="sendMessage"
                class="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 text-sm sm:text-base rounded-md hover:bg-gray-300 transition duration-300">
                Message
              </button>
            </div>
          </div>
        </div>

        <!-- Followers/Following Count -->
        <div class="flex justify-center sm:justify-start space-x-6 mt-4">
          <div class="text-center">
            <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ profile.followers_count }}
            </p>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Followers</p>
          </div>
          <div class="text-center">
            <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ profile.following_count }}
            </p>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">Following</p>
          </div>
        </div>

        <!-- Bio -->
        <div class="mt-4">
          <input v-model="profile.bio"
            class="w-full p-2 text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 transition duration-300"
            placeholder="Enter your bio...">
          <button @click="updateBio"
            class="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-300">
            Update Bio
          </button>
        </div>

        <!-- Privacy Toggle -->
        <div class="mt-4 flex items-center justify-between sm:justify-start">
          <span class="text-sm sm:text-base text-gray-700 dark:text-gray-200">Private Account</span>
          <label class="switch ml-2">
            <input type="checkbox" v-model="profile.is_private" @change="togglePrivacy">
            <span class="slider round"></span>
          </label>
        </div>

        <!-- Delete Account Button -->
        <div class="mt-6">
          <button @click="deleteAccount"
            class="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 text-white text-sm sm:text-base rounded-md hover:bg-red-600 transition duration-300 w-full sm:w-auto">
            Delete Account
          </button>
        </div>
      </div>

      <!-- Tabbed View -->
      <div>
        <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
            :class="['px-4 py-2 font-medium', currentTab === tab.id ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400']">
            {{ tab.name }}
          </button>
        </div>

        <!-- Tab Content -->
        <div v-if="currentTab === 'posts'">
          <ExplorePostCard v-for="post in posts" :key="post.id" :post="post" :showHashtags="false" />
        </div>
        <div v-else-if="currentTab === 'likedposts'">
          <ExplorePostCard v-for="post in posts" :key="post.id" :post="post" :showHashtags="false" />
        </div>
        <div v-else-if="currentTab === 'following'">
          <UserProfileSmall v-for="index in 20" :key="index" />
        </div>
        <div v-else-if="currentTab === 'followers'">
          <UserProfileSmall v-for="index in 20" :key="index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiPencilLine } from "oh-vue-icons/icons";
import ExplorePostCard from '@/components/ExplorePostCard.vue';
import UserProfileSmall from '@/components/UserProfileSmall.vue';
import { usePostStoryStore } from '../../stores/homePageStore';

addIcons(RiPencilLine);

const postStoryStore = usePostStoryStore();
const profile = ref(null);
const isLoading = ref(true);
const currentTab = ref('posts');
const tabs = [
  { id: 'posts', name: 'Posts' },
  { id: 'likedposts', name: 'Liked' },
  { id: 'following', name: 'Following' },
  { id: 'followers', name: 'Followers' },
];

onMounted(async () => {
  try {
    await postStoryStore.fetchUserProfile();
    profile.value = postStoryStore.myProfile;
  } catch (error) {
    console.error("Error loading profile:", error);
  } finally {
    isLoading.value = false;
  }
});

const editProfilePhoto = () => console.log('Edit profile photo');
const togglePrivacy = () => console.log('Privacy toggled:', profile.value.is_private);
const deleteAccount = () => console.log('Delete account');
const updateBio = () => console.log('Bio updated:', profile.value.bio);
const sendMessage = () => console.log('Message sent');
const toggleFollow = () => console.log('Follow toggled');
</script>



<style scoped>
.grid-layout {
  column-gap: 1rem;
  column-count: 3;
}

@media (max-width: 768px) {
  .grid-layout {
    column-count: 2;
  }
}

@media (max-width: 480px) {
  .grid-layout {
    column-count: 2;
  }
}

/* Toggle switch styles */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked+.slider {
  background-color: #2196F3;
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
