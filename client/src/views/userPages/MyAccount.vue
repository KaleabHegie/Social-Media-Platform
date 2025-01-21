<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Loading or Error State -->
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <div class="loader"></div>
    </div>

    <div v-else-if="!profile" class="text-center text-gray-500 dark:text-gray-400">
      {{ t('Noprofile') }}
    </div>

    <!-- Profile Content -->
    <div v-else>
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <!-- Settings Icon -->
        <div class="flex justify-end">
          <button @click.stop="toggleSettingsMenu"
            class="bg-gray-200 dark:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center">
            <i class="ri-settings-3-line text-xl text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
        <!-- Dropdown Menu -->
        <div class="flex justify-end">
          <div v-if="showSettingsMenu" ref="dropdown"
            class="absolute mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <ul class="py-2 relative">
              <!-- Language Selector -->
              <li class="flex justify-between px-4 py-2   text-gray-700 dark:text-gray-300">
                {{ t('language') }}
                <LanguageSelector />
              </li>
              <!-- Dark Mode Toggle -->
              <li class="flex justify-between px-4 py-2  text-gray-700 dark:text-gray-300">
                {{ t('theme') }}
                <DarkModeToggle />
              </li>
              <!-- Privacy Toggle -->
              <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <button @click="togglePrivacy" class="w-full text-left text-gray-700 dark:text-gray-300">
                  {{ profile.is_private ? t('switchPublic') : t('switchPrivate') }}
                </button>
              </li>
              <!-- Delete Account -->
              <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <button @click="openModal" class="w-full text-left text-red-500">
                  <i class="ri-delete-bin-line text-red-500"></i> {{ t('delete') }}
                </button>
              </li>
              <!-- Logout -->
              <li class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <button @click="logout" class="flex items-center w-full space-x-3 text-gray-700 dark:text-gray-300">
                  <i class="ri-logout-box-line text-gray-500 dark:text-gray-400"></i>
                  <span>{{ t('Logout') }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <!-- Profile Info Section -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <!-- Profile Photo and Info -->
          <div class="relative">
            <img v-if="profile.profile_photo_url" :src="profile.profile_photo_url" alt="Profile Photo"
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover">
            <img v-else src="../../assets/avatar.jpg" alt="avatar"
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover">
            <button @click="triggerFileInput"
              class="absolute bottom-0 right-0 bg-sky-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white">
              <i class="ri-camera-line text-white text-sm"></i>
            </button>

            <input type="file" ref="fileInput" accept="image/*" @change="handlePhotoUpload" class="hidden">
          </div>

          <!-- User Info -->
          <div class="flex-grow text-center sm:text-left">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {{ profile.first_name }} {{ profile.last_name }}
            </h1>
            <p class="text-gray-600 dark:text-gray-300">@{{ profile.user_name }}</p>

            <div class="mt-3 space-x-2">
              <h1 class="text-gray-600 dark:text-gray-300"> {{ profile.bio }} </h1>
            </div>
          </div>
        </div>

        <!-- Followers/Following Count -->
        <div class="flex justify-center sm:justify-start space-x-6 mt-4">
          <div class="text-center">
            <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ profile.followers_count }}
            </p>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300"> {{ t('followers') }}</p>
          </div>
          <div class="text-center">
            <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ profile.following_count }}
            </p>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300"> {{ t('following') }}</p>
          </div>
        </div>

        <!-- Bio -->
        <div class="mt-4">
          <input v-model="profile.bio"
            class=" sm:align-middle px-6  py-2 mr-2 rounded-md text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-sky-500 transition duration-300"
            placeholder="Enter your bio...">
          <button @click="updateBio"
            class="mt-2 px-4 py-2 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-600 transition duration-300">
            {{ t('updateBio') }}
          </button>
        </div>
      </div>
      <!-- Confirmation Modal -->
      <ConfirmationModal :isVisible="isModalVisible" @confirm="confirmDeleteAccount" @cancel="closeModal"
        class="z-10 dark:bg-black " />
    </div>

    <!-- Tabbed View for Posts/Following/Followers -->
    <div>
      <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
          :class="['px-4 py-2 font-medium', currentTab === tab.id ? 'text-sky-500 border-b-2 border-sky-500' : 'text-gray-500 dark:text-gray-400']">
          {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="currentTab === 'posts'">
        <div v-if="myposts.length" class="grid-layout">
          <ExplorePostCard v-for="post in myposts" :key="post.id" :post="post" :showHashtags="true" />
        </div>
        <p v-else class="text-center text-gray-500 dark:text-gray-400"> {{ t('noPosts') }}</p>
      </div>

      <!-- Liked Posts Tab -->
      <div v-if="currentTab === 'likedposts'">
        <div v-if="likedposts.length" class="grid-layout">
          <ExplorePostCard v-for="post in likedposts" :key="post.id" :post="post" :showHashtags="false" />
        </div>
        <p v-else class="text-center text-gray-500 dark:text-gray-400"> {{ t('noLiked') }}</p>
      </div>

      <div v-else-if="currentTab === 'following'">
        <div v-if="following.length === 0">
          <p class="text-center text-gray-500 dark:text-gray-400"> {{ t('nofollowing') }}</p>
          <!-- Message for no following -->
        </div>
        <div v-else class="grid-layout">
          <UserProfileSmall v-for="follow in following" :key="follow.id" :follow="follow" />
        </div>
      </div>


      <div v-else-if="currentTab === 'followers'">
        <div v-if="followers.length === 0">
          <p class="text-center text-gray-500 dark:text-gray-400"> {{ t('nofollowers') }}</p>
          <!-- Message for no followers -->
        </div>
        <div v-else class="grid-layout">
          <UserProfileSmall v-for="follow in followers" :key="follow.id" :follow="follow" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiPencilLine } from "oh-vue-icons/icons";
import { useRouter } from 'vue-router'
import ExplorePostCard from '@/components/ExplorePostCard.vue';
import PostCard from '@/components/PostCard.vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';
import LanguageSelector from '@/components/LanguageSelector.vue';
import UserProfileSmall from '@/components/UserProfileSmall.vue';
import { usePostStoryStore } from '../../stores/homePageStore';
import { useAuthStore } from '../../stores/authStore';
import ToastService from '@/utils/toast.js';
import ConfirmationModal from '@/components/ConfirmationModal.vue'; // Import your modal component
import { useLanguageStore } from '@/stores/languageStore';

const { t, switchLanguage } = useLanguageStore();
const currentLanguage = ref('en');
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'am' : 'en';
  switchLanguage(currentLanguage.value);
};



const togglePrivacy = async () => {
  try {
    profile.value.is_private = !profile.value.is_private;
    const response = await postStoryStore.updateAccountType(profile.value.is_private);
    toast.success('Account type changed successfully!', { position: "top-center" });
  } catch (error) {
    console.error('Error changing account type:', error.message);
    toast.error('Failed to change account type.', { position: "top-center" });
  }
};

addIcons(RiPencilLine);

const router = useRouter();
const authStore = useAuthStore()

const toast = ToastService();
const postStoryStore = usePostStoryStore();
const profile = ref(null);
const myposts = ref([]);
const following = ref([]);
const followers = ref([]);
const likedposts = ref([]);
const isLoading = ref(true);
const currentTab = ref('posts');
const tabs = [
  { id: 'posts', name: t('tabsposts') },
  { id: 'likedposts', name: t('tabsliked') },
  { id: 'following', name: t('tabsfollowing') },
  { id: 'followers', name: t('tabsfollowers') },
];


onMounted(async () => {
  try {
    const response = await postStoryStore.fetchUserProfile();
    profile.value = postStoryStore.myProfile;
    myposts.value = postStoryStore.myPosts;
    likedposts.value = postStoryStore.likedPosts;
    following.value = postStoryStore.myProfile.following;
    followers.value = postStoryStore.myProfile.followers;
  } catch (error) {
    console.error("Error loading profile:", error);
  } finally {
    isLoading.value = false;
  }
});

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    await postStoryStore.updateProfilePhoto(file);
    toast.success('Profile photo updated successfully!', { position: 'top-center' });
  } catch (error) {
    toast.error('Failed to update profile photo.', { position: 'top-center' });
    console.error('Error uploading photo:', error.message);
  } finally {
    event.target.value = ''; // Reset input
  }
};

const isModalVisible = ref(false); // State to control modal visibility

// Opens the modal
const openModal = () => {
  isModalVisible.value = true;
};

// Closes the modal
const closeModal = () => {
  isModalVisible.value = false;
};

// Confirms the account deletion
const confirmDeleteAccount = async () => {
  console.log("Account deleted for:", profile.value.user_name);
  await postStoryStore.deleteAccount();
  await authStore.logout()
  closeModal(); // Close the modal after confirming the delete
  router.push('/signin');
};

// Handles bio update
const updateBio = async () => {
  try {
    const response = await postStoryStore.updateBio(profile.value.bio);
    toast.success('Bio Updated successful!', { position: "top-center" });
  }
  catch (error) {
    console.error('Error creating post:', error.message);
  }
}

const showSettingsMenu = ref(false);

const toggleSettingsMenu = () => {
  showSettingsMenu.value = !showSettingsMenu.value;
};

document.addEventListener('click', (event) => {
  // Close the dropdown when clicking outside
  const dropdown = document.querySelector('.relative');
  if (dropdown && !dropdown.contains(event.target)) {
    showSettingsMenu.value = false;
  }
});


// Logout function
const logout = () => {
  authStore.logout();
  router.push("/signin");
};
</script>




<style scoped>
.relative ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.relative li {
  cursor: pointer;
}

.loader {
  border: 4px solid #f3f3f3;
  /* Light grey */
  border-top: 4px solid #3498db;
  /* sky */
  border-radius: 50%;
  align-items: center;
  margin-top: 300px;
  width: 70px;
  height: 70px;
  animation: spin 1s linear infinite;
}


.grid-layout {
  column-gap: 1rem;
  column-count: 3;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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
