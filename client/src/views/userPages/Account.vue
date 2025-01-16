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
            <img :src="profile.profile_photo_url || '/default-avatar.png'"
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover">

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

              <router-link :to="`/messages`" class="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                <button
                  class="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 text-sm sm:text-base rounded-md hover:bg-gray-300 transition duration-300">

                  {{ t('message') }}
                </button>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Followers/Following Count -->
        <div class="flex justify-center sm:justify-start space-x-6 mt-4">
          <div class="text-center">
            <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ profile.followers_count }}
            </p>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">{{ t('follower') }}</p>
          </div>
          <div class="text-center">
            <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {{ profile.following_count }}
            </p>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">{{ t('following') }}</p>
          </div>
        </div>

        <!-- Bio -->
        <div v-if="profile.bio" class="mt-4">
          <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 break-words">
            {{ profile.bio }}
          </p>
        </div>



        <!-- Privacy Toggle -->

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
          <div v-if="myposts.length" class="grid-layout">
            <ExplorePostCard v-for="post in myposts" :key="post.id" :post="post" :showHashtags="true" />
          </div>
          <p v-else class="text-center text-gray-500 dark:text-gray-400">No posts available.</p>
        </div>

        <!-- Liked Posts Tab -->
        <div v-if="currentTab === 'likedposts'">
          <div v-if="likedposts.length" class="grid-layout">
            <ExplorePostCard v-for="post in likedposts" :key="post.id" :post="post" :showHashtags="false" />
          </div>
          <p v-else class="text-center text-gray-500 dark:text-gray-400">No liked posts yet.</p>
        </div>


        <div v-else-if="currentTab === 'following'">
          <div v-if="following.length === 0">
            <p class="text-xl text-gray-800 dark:text-gray-200">No following yet.</p> <!-- Message for no following -->
          </div>
          <div v-else class="grid-layout">
            <UserProfileSmall v-for="follow in following" :key="follow.id" :follow="follow" />
          </div>
        </div>


        <div v-else-if="currentTab === 'followers'">
          <div v-if="followers.length === 0">
            <p class="text-xl text-gray-800 dark:text-gray-200">No followers yet.</p> <!-- Message for no followers -->
          </div>
          <div v-else class="grid-layout">
            <UserProfileSmall v-for="follow in followers" :key="follow.id" :follow="follow" />
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiPencilLine } from "oh-vue-icons/icons";
import PostCard from '@/components/PostCard.vue';
import ExplorePostCard from '@/components/ExplorePostCard.vue';
import { useLanguageStore } from '@/stores/languageStore';
import UserProfileSmall from '@/components/UserProfileSmall.vue';
import { usePostStoryStore } from '../../stores/homePageStore';
import { useRoute } from 'vue-router';
import ToastService from '@/utils/toast.js';
import Explore from './Explore.vue';

const toast = ToastService();
const { t } = useLanguageStore();

const route = useRoute();
const userId = route.params.id;

addIcons(RiPencilLine);

const postStoryStore = usePostStoryStore();
const profile = ref(null);
const myposts = ref([]);
const likedposts = ref([]);
const isLoading = ref(true);
const following = ref([]);
const followers = ref([]);
const currentTab = ref('posts')
const tabs = [
  { id: 'posts', name: 'Posts' },
  { id: 'likedposts', name: 'Liked' },
  { id: 'following', name: 'Following' },
  { id: 'followers', name: 'Followers' },
];


onMounted(async () => {
  try {
    await postStoryStore.fetchOtherUserProfile(userId);
    profile.value = postStoryStore.myProfile;
    myposts.value = postStoryStore.usersposts;
    likedposts.value = postStoryStore.likedPosts;
    following.value = postStoryStore.myProfile.following;
    followers.value = postStoryStore.myProfile.followers;
    // following.value = postStoryStore.following; //@todo kalab this object are not found
    // followers.value = postStoryStore.followers;//@todo kalab this object are not found
  } catch (error) {
    console.error("Error loading profile:", error);
  } finally {
    isLoading.value = false;
  }
});


const sendMessage = () => console.log('Message sent');
const toggleFollow = async () => {
  await postStoryStore.followUser(profile.value._id);
  toast.success('Successfull!', { position: 'top-center' });
};
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
