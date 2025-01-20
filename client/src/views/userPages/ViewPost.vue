<template>
    <div class="min-h-screen pt-4 pb-20 px-4 lg:px-8">
        <!-- Close button -->
        <div class="mb-4">
            <button @click="goBack"
                class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
                <oh-vue-icon name="ri-close-line" class="w-6 h-6" />
            </button>
        </div>

        <!-- Main content -->
        <div class="flex-grow flex flex-col md:flex-row">
            <!-- Left side: Existing Post component -->
            <div class="w-full md:w-1/2 mb-4 md:mb-0 md:pr-4">

                <template v-if="post">
                    <!-- PostCard component -->
                    <PostCard :post="post" />
                </template>
                <p v-else class="text-gray-500 dark:text-gray-400">
                    {{ t('loadingPosts') }}
                </p>
            </div>

            <!-- Right side: Comments section -->
            <div
                class="w-full md:w-1/2 flex flex-col rounded-xl shadow-lg border border-[#ffffff65] dark:border-gray-700 md:h-[calc(100vh-10rem)] shadow-gray-300 dark:shadow-gray-800">
                <!-- Comments list -->
                <div class="flex-grow overflow-y-auto">
                    <div class="p-4">
                        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {{ t('comment') }}
                        </h2>
                        <template v-if="post">
                            <!-- PostCard component -->
                            <CommentCard v-for="(comment, index) in post.comments" :key="index" :comment="comment" />
                        </template>
                        <p v-else class="text-gray-500 dark:text-gray-400">
                            {{ t('noPosts') }}
                        </p>
                    </div>
                </div>

                <!-- New comment input -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center">
                        <input v-model="newComment" type="text" :placeholder="t('addComment')"
                            class="flex-grow mr-2 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <button @click="addComment"
                            class="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600">
                            {{ t('comment') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiCloseLine } from "oh-vue-icons/icons";
import CommentCard from '@/components/CommentCard.vue';
import PostCard from '@/components/PostCard.vue';
import { usePostStoryStore } from '@/stores/homePageStore';
import { useAuthStore } from '@/stores/authStore';
import { useLanguageStore } from '@/stores/languageStore';


addIcons(RiCloseLine);

const router = useRouter();
const route = useRoute();

const store = usePostStoryStore();
const authStore = useAuthStore()
const postId = route.params.id;
const post = ref(null);

const goBack = () => {
    router.back();
};

const { t } = useLanguageStore();
const newComment = ref('');
const content = {
    postId: postId,
    content: newComment.value
}

const addComment = async () => {
    
    if (newComment.value.trim()) {
        // Create a comment object to add
        content.content = newComment.value;

        // Add the comment using the store method
        const message = await store.addComment(content);



        message.comment.sender = authStore.user


        // Clear the input field
        newComment.value = '';

        // Ensure comments array exists
        if (!post.value.comments) {
            post.value.comments = []; // Initialize comments as an empty array if not defined
        }

        // Optionally, add the comment to the local post comments list
        const addedComment = {
            content: content.content,
            // Add other necessary comment properties (e.g., user info, timestamps)
        };

        post.value.comments.push(message.comment); // Push the new comment
    }
};


onMounted(async () => {
    if (!store.hasPosts) {
        await store.fetchPosts();
    }
    console.log(  '--------------' , await store)
    const foundPost = await store.getPostById(postId);
    post.value = foundPost || null; // Handle case when post is not found
});
</script>
