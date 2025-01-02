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
                <!-- Post component -->
                <PostCard :post="post" />
            </div>

            <!-- Right side: Comments section -->
            <div class="w-full md:w-1/2 flex flex-col rounded-xl shadow-lg border border-[#ffffff65] dark:border-gray-700 md:h-[calc(100vh-10rem)] 
            shadow-gray-300 dark:shadow-gray-800">
                <!-- Comments list -->
                <div class="flex-grow overflow-y-auto">
                    <div class="p-4">
                        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Comments
                        </h2>

                        <CommentCard v-for="index in 20" :key="index" />
                    </div>
                </div>

                <!-- New comment input (fixed at bottom on desktop, scrollable on mobile) -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 mb-4">
                    <div class="flex items-center">
                        <input v-model="newComment" type="text" placeholder="Add a comment..."
                            class="flex-grow mr-2 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <button @click="addComment"
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiCloseLine } from "oh-vue-icons/icons";
import CommentCard from '@/components/CommentCard.vue';
import PostCard from '@/components/PostCard.vue';

addIcons(RiCloseLine);
const router = useRouter();


const goBack = () => {
    router.back();
};

const addComment = () => {
    console.log("Adding commentttt");
};


const post = {
    username: 'user 1',
    userAvatar: `https://via.assets.so/movie.png?id=1&q=95&w=360&h=360&fit=fill`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    media: [
        {
            type: 'image',
            url: `https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill`,
            description: 'Sample post image'
        },
        {
            type: 'image',
            url: `https://via.assets.so/watch.png?id=2&q=95&w=360&h=360&fit=fill`,
            description: 'Sample post image 2'
        }
    ],
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    hashtags: ['photography', 'nature', 'travel'],
    caption: `This is a sample caption for post number. It can be long or short dependin  It can be long or short depe  It can be long or short depeg on the content. his is a sample caption for post number`
}


</script>