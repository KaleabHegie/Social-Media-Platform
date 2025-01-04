<template>
    <div class="flex items-start space-x-4 mb-4 p-4 border rounded-xl border-gray-300 dark:border-gray-700">
        <img src="https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill" alt="avater"
            class="w-10 h-10 rounded-full">
        <div class="flex-grow">
            <div class="flex items-center justify-between">
                <h3 class="font-bold text-gray-800 dark:text-gray-200">user_name_1</h3>
                <button @click="deleteComment" class="text-red-500 hover:text-red-700">
                    <oh-vue-icon name="ri-delete-bin-line" class="w-5 h-5" />
                </button>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mt-1">this is comment contentn woow amazing comment</p>
            <div class="flex items-center mt-2">
                <button @click="likeComment" class="flex items-center text-gray-500 hover:text-blue-500">
                    <oh-vue-icon name="ri-heart-line" class="w-5 h-5 mr-1" />
                    <span>5</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { RiHeartLine, RiDeleteBinLine } from "oh-vue-icons/icons";

addIcons(RiHeartLine, RiDeleteBinLine);

const props = defineProps({

});


const likeComment = () => {
    // Implement like functionality here
    console.log('Likeing a comment:');
};

const deleteComment = () => {
    console.log("Deleting commentttt");
}
</script>