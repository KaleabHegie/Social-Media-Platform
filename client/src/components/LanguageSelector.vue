<template>
    <button @click="switchLanguage"
        class="bg-sky-400 dark:bg-sky-700 hover:bg-sky-400 dark:hover:bg-sky-600 text-white px-3 py-1 rounded">
        {{ currentLanguage === 'en' ? 'አማ' : 'Eng' }}
    </button>
</template>

<script setup>
import { useLanguageStore } from '@/stores/languageStore';

// Initialize the language store
// Access the language store
const { currentLanguage, switchLanguage, t } = useLanguageStore();


</script>

<style scoped></style>