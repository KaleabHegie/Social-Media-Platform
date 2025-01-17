<template>
  <!-- Comment Card Template -->
  <div class="flex items-start space-x-4 mb-4 p-4 border rounded-xl border-gray-300 dark:border-gray-700">
    <img :src="comment.sender.profile_photo_url || '/default-avatar.png'" alt="avatar" class="w-10 h-10 rounded-full" />
    <div class="flex-grow">

      <div class="flex items-center justify-between">
        <h3 class="font-bold text-gray-800 dark:text-gray-200">{{ comment.sender.user_name }} {{ comment.sender.username }}</h3>
        <!-- <button @click="deleteComment" class="text-red-500 hover:text-red-700">
            <oh-vue-icon name="ri-delete-bin-line" class="w-5 h-5" />
          </button> -->
        <time :datetime="comment.createdAt" class="text-sm text-gray-200">
          {{ formatDate(comment.createdAt) }}
        </time>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mt-1">{{ comment.content }}</p>
      <div class="flex items-center mt-2">
        <button @click="likeComment" class="flex items-center text-gray-500 hover:text-sky-500">
          <oh-vue-icon name="ri-heart-line" class="w-5 h-5 mr-1" />
          <span>{{ comment.likes.getComments }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiHeartLine, RiDeleteBinLine } from "oh-vue-icons/icons";
import { format } from 'date-fns';
addIcons(RiHeartLine, RiDeleteBinLine);

// Define the props for comment
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const formatDate = (date) => {
  const formattedDate = new Date(date);
  if (isNaN(formattedDate)) {
    return ''; // Return empty string if the date is invalid
  }
  return format(formattedDate, 'MMM d, yyyy • HH:mm');
};


// Log props to check
// Like functionality
const likeComment = () => {
  // Implement like functionality here
  console.log('Liking comment:', props.comment._id);
};

// Delete functionality
const deleteComment = () => {
  console.log("Deleting comment with ID:", props.comment._id);
};
</script>