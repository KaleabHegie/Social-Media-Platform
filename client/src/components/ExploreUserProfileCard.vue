<template>
  <div
    class="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-colors duration-200 hover:shadow-xl">
    <router-link :to="`/viewAccount/${user.id}`"
      class="relative h-24 bg-gradient-to-r from-sky-300 to-sky-500 flex items-end px-6 pb-4 hover:underline text-white">
      <!-- Avatar -->
      <div class="relative -mb-10">
        <img v-if="user.avatar_url" :src="user.avatar_url" :alt="`${user.first_name} ${user.last_name}`"
          class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover" />
        <div v-else
          class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <UserIcon class="w-12 h-12 text-gray-500 dark:text-gray-400" />
        </div>
        <div v-if="user.isFollowing" class="absolute bottom-0 right-0 bg-green-500 rounded-full p-1"
          title="You are following this user">
          <CheckIcon class="w-4 h-4 text-white" />
        </div>
        <div v-else class="absolute bottom-0 right-0 bg-sky-300 rounded-full p-1"
          title="You are following this user">
          <PlusIcon class="w-4 h-4 text-white" />
        </div>
      </div>
      <!-- Username -->
      <div class="ml-4 text-white">
        <h2 class="font-semibold text-lg">{{ user.first_name }} {{ user.last_name }}</h2>
        <p class="flex items-center text-sm">
          <AtSignIcon class="w-4 h-4 mr-1" />
          {{ user.user_name }}
        </p>
      </div>
    </router-link>
    <div class="px-6 pt-10 pb-6">
      <div v-if="user.bio" class="mb-1">
        <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <i class="ri-pencil-line"></i>
          {{ user.bio }}
        </p>
      </div>
      <!-- <div class="flex justify-end gap-2 mb-1">
        <div class="text-center">
          <p class="font-semibold text-2xl text-gray-700 dark:text-gray-200">{{ user.followers_count }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Followers</p>
        </div>
        <div class="text-center">
          <p class="font-semibold text-2xl text-gray-700 dark:text-gray-200">{{ user.following_count }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Following</p>
        </div>
      </div> -->
    </div>
  </div>
</template>


<script setup>
import { UserIcon, CheckIcon, AtSignIcon, MapPinIcon,PlusIcon } from 'lucide-vue-next'

defineProps({
  user: {
    type: Object,
    required: true,
  }
})
</script>