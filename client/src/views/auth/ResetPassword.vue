<template>
    <div
        class="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-xl overflow-hidden flex items-center justify-center py-12 sm:px-6 lg:px-8">
        <div class="absolute inset-0 z-0">
            <img src="@/assets/whitebg.png" alt="Background"
                class="fixed w-full h-full object-cover opacity-40 dark:hidden" />
            <img src="@/assets/darkbg.jpg" alt="Background"
                class="fixed w-full h-full object-cover opacity-20 hidden dark:block" />
        </div>
        <div class="w-full max-w-md z-10">
            <div
                class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- Logo Section -->
                <div class="text-center -mt-24 h-64">
                    <img src="@/assets/logo.svg" alt="Tsede Logo" />
                </div>

                <!-- Language Dropdown and Dark Mode Toggle -->
                <div class="flex justify-between items-center mb-10">
                    <DarkModeToggle />
                    <LanguageSelector />
                </div>

                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">{{ t('reset') }}
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    {{ t('or') }}
                    <router-link to="/signin" class="font-medium text-sky-400 hover:text-sky-500">
                        {{ t('return') }}
                    </router-link>
                </p>

                <!-- Form -->
                <form @submit.prevent="handleSubmit">
                    <!-- Password Field -->
                    <div class="relative mt-8 mb-4">
                        <label for="password"
                            class="absolute -top-2 left-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-sm font-medium px-1">
                            {{ t('password') }}
                        </label>
                        <div class="mt-2">
                            <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                                required
                                class="appearance-none block w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                :class="{ 'border-red-500': errors.password }" />
                            <!-- Toggle Password Visibility -->
                            <button type="button" @click="togglePasswordVisibility"
                                class="absolute right-3 top-3 text-sky-400 hover:text-sky-500">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path
                                        d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path
                                        d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                                    <path
                                        d="M3.515 3.515l17 17M9.172 9.172A3.001 3.001 0 0112 9c1.657 0 3 1.343 3 3 0 .828-.336 1.578-.88 2.121m-.948.947a2.999 2.999 0 01-4.24-4.24" />
                                </svg>
                            </button>
                        </div>
                        <p v-if="errors.password" class="text-sm text-red-500 mt-1">{{ errors.password }}</p>
                    </div>

                    <!-- Confirm Password Field -->
                    <div class="relative mb-4">
                        <label for="confirm-password"
                            class="absolute -top-2 left-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-sm font-medium px-1">
                            {{ t('confirmpass') }}
                        </label>
                        <div class="mt-2">
                            <input id="confirm-password" v-model="formData.confirm_password"
                                :type="showPassword ? 'text' : 'password'" required
                                class="appearance-none block w-full px-3 py-2 border bg-white dark:bg-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                :class="{ 'border-red-500': errors.confirm_password }" />
                            <button type="button" @click="togglePasswordVisibility"
                                class="absolute right-3 top-3 text-sky-400 hover:text-sky-500">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path
                                        d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path
                                        d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
                                    <path
                                        d="M3.515 3.515l17 17M9.172 9.172A3.001 3.001 0 0112 9c1.657 0 3 1.343 3 3 0 .828-.336 1.578-.88 2.121m-.948.947a2.999 2.999 0 01-4.24-4.24" />
                                </svg>
                            </button>
                        </div>
                        <p v-if="errors.confirm_password" class="text-sm text-red-500 mt-1">{{ errors.confirm_password
                            }}</p>
                    </div>

                    <!-- Submit Button -->
                    <div>
                        <button type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-400 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                            <span>{{ t('submit') }}</span>
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';
import { useAuthStore } from '@/stores/authStore';
import { useRoute, useRouter } from 'vue-router';
import LanguageSelector from '@/components/LanguageSelector.vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';
import ToastService from '@/utils/toast.js';

const { t } = useLanguageStore();
const router = useRouter();
const route = useRoute();
const toast = ToastService();
const showPassword = ref(false);

const formData = reactive({
    password: '',
    confirm_password: '',
    token: route.params.token
});

const errors = reactive({
    password: '',
    confirm_password: ''
});

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

// Validation function that runs only on submit
const isValid = () => {
    // First, check if the password is provided
    if (!formData.password) {
        errors.password = 'Password is required.';
        return false;
    }


    // Password validation
    const hasLetter = /[A-Za-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSpecialChar = /[@$!%*#?&]/.test(formData.password);
    const isLongEnough = formData.password && formData.password.length >= 8;
    if (!formData.password) {
        errors.password = 'Password is required.';
    } else if (!isLongEnough) {
        errors.password = 'Password must be at least 8 characters long.';
    } else if (!hasLetter) {
        errors.password = 'Password must include at least one letter.';
    } else if (!hasNumber) {
        errors.password = 'Password must include at least one number.';
    } else if (!hasSpecialChar) {
        errors.password = 'Password must include at least one special character (@, $, !, %, *, #, ?, &).';
    } else {
        errors.password = '';
    }

    // Confirm password validation
    errors.confirm_password = formData.password !== formData.confirm_password
        ? 'Passwords do not match.'
        : '';

    return !errors.email && !errors.password && !errors.confirm_password;
};

// Form Submission
const handleSubmit = async () => {
    if (!isValid()) {
        return;
    }

    const authStore = useAuthStore();

    try {
        const success = await authStore.resetPassword(formData);
        if (success) {
            toast.success('Password update successful!', { position: "top-center" });
            route.push('/signin');
        } else {
            toast.success('Password update failed.', { position: "top-center" });
        }
    } catch (err) {
        console.error('Error submitting form:', err);
    }
};
</script>
