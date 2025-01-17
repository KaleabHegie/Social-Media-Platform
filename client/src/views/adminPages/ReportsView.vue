<template>
    <div class="space-y-6">
      <h1 class="text-2xl font-semibold text-sky-800">Reported Posts</h1>
      
      <div v-if="reportedPosts.length === 0" class="text-center py-10">
        <i class="ri-file-list-3-line text-5xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-600">No reported posts at the moment.</p>
      </div>
      
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ReportedPost
          v-for="post in reportedPosts"
          :key="post.postId"
          :post="post"
        @delete="deletePost"
          @view="viewPost"
        />
      </div>
    </div>

    <ViewPostAdmin
      v-if="selectedPost"
      :post="selectedPost"
      @close="closePostPopup"
    />
</template>

<script setup>
import { ref } from 'vue';
import ReportedPost from '../../components/AdminComponents/ReportedPost.vue';
import ViewPostAdmin from '../../components/AdminComponents/ViewPostAdmin.vue';

// Mock data for reported posts
const reportedPosts = ref([
  {
    postId: '1',
    content: 'This is the content of the reported post #1. It might contain offensive or inappropriate material.',
    users: [
      { userId: 'user1', username: 'JohnDoe', avatarUrl: 'https://via.placeholder.com/40', reason: 'Inappropriate content' },
      { userId: 'user2', username: 'JaneSmith', avatarUrl: 'https://via.placeholder.com/40', reason: 'Spam' }
    ]
  },
  {
    postId: '2',
    content: 'This is the content of the reported post #2. It might violate community guidelines.',
    users: [
      { userId: 'user3', username: 'BobJohnson', avatarUrl: 'https://via.placeholder.com/40', reason: 'Harassment' },
      { userId: 'user4', username: 'AliceWilliams', avatarUrl: 'https://via.placeholder.com/40', reason: 'False information' }
    ]
  },
  {
    postId: '3',
    content: 'This is the content of the reported post #3. It might contain sensitive material.',
    users: [
      { userId: 'user5', username: 'CharlieBrown', avatarUrl: 'https://via.placeholder.com/40', reason: 'Violent content' }
    ]
  }
]);

const selectedPost = ref(null);

const deletePost = (postId) => {
  // In a real application, this would send a request to the backend
  console.log('Deleting post:', postId);
  reportedPosts.value = reportedPosts.value.filter(post => post.postId !== postId);
};

const viewPost = (post) => {
  selectedPost.value = post;
};

const closePostPopup = () => {
  selectedPost.value = null;
};
</script>

