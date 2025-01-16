<template>
    <div
        class=" min-h-screen bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300  shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8">
        <div class="absolute inset-0 z-0">
            <img src="@/assets/whitebg.png" alt=""
                class="fixed w-full h-full object-cover opacity-40 dark:opacity-10" />
        </div>
        <div class="w-full max-w-md z-10">
            <div
                class="bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- Logo Section -->
                <div class="text-center -mt-24 h-64">
                    <img src="@/assets/logo.svg" alt="Tsede Logo" />
                </div>
                <!-- Language Dropdown and Dark Mode Toggle -->
                <div class="flex justify-between items-center mb-10">
                    <DarkModeToggle />
                    <LanguageSelector />
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">{{ t('reset') }}</h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    {{ t('or') }}
                    <router-link to="/signin" class="font-medium text-sky-400 hover:text-sky-500">
                        {{ t('return') }}
                    </router-link>
                </p>

                <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div v-if="emailSent" class="rounded-md bg-green-50 p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <!-- Heroicon name: check-circle -->
                                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-green-800">
                                    {{ t('resetSent') }}
                                </h3>
                                <div class="mt-2 text-sm text-green-700">
                                    <p>
                                        {{ t('instructions') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form v-else class="space-y-6" @submit.prevent="handleSubmit">
                        <div>
                            <label for="email"
                                class="block text-sm font-medium bg-white dark:bg-gray-800  text-gray-900 dark:text-gray-300 px-1 ml-2 -mb-3 z-10 relative w-fit">
                                {{ t('email') }}
                            </label>
                            <div class="mt-1">
                                <input id="email" v-model="form.email" type="email" required
                                    class="appearance-none block w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                    :class="{ 'border-red-500': errors.email }" />
                                <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                                    {{ errors.email }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <button type="submit" :disabled="loading"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                                <span v-if="loading" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ t('process') }}
                                </span>
                                <span v-else> {{ t('send') }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';  // Assuming this store exists
import { useLanguageStore } from '@/stores/languageStore';
import LanguageSelector from '@/components/LanguageSelector.vue';
import { SunIcon, MoonIcon } from 'lucide-vue-next';
const { currentLanguage, t } = useLanguageStore();
const { forgotPassword, error } = useAuthStore();  // Assuming forgotPassword is a method in your authStore
import DarkModeToggle from '../../components/DarkModeToggle.vue';

// Form data and state
const form = reactive({
    email: '',
});

const errors = reactive({});
const loading = ref(false);
const emailSent = ref(false);


// Validation method
const validateForm = () => {
    errors.email = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        errors.email = t('invalid_email');
        return false;
    }
    return true;
};

// Submit handler
const handleSubmit = async () => {
    if (!validateForm()) return;

    loading.value = true;
    try {
        const response = await forgotPassword(form.email);

        if (response) {
            emailSent.value = true;
        } else {
            errors.email = t('unable_to_process');
        }
    } catch (error) {
        console.error('Error sending reset instructions:', error);
    } finally {
        loading.value = false;
    }
};
</script>
